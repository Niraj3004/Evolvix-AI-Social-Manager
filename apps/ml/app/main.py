from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
import pandas as pd
from typing import Optional
from datetime import datetime
import sys
import os

# Add parent directory to path to import app modules if running directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import get_db
from registry import load_latest_bundle
from features import build_features

app = FastAPI(title="Evolvix ML Service", version="2.0")

# Load model globally on startup
model_bundle = load_latest_bundle()

class PlannedPost(BaseModel):
    scheduledFor: datetime
    body: str
    platform: str
    content_type: Optional[str] = "post"

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    model_status = "loaded" if model_bundle else "missing"
        
    return {"status": "ok", "db": db_status, "model": model_status}

@app.post("/predict/engagement")
def predict_engagement(post: PlannedPost):
    if not model_bundle:
        raise HTTPException(status_code=503, detail="No trained model available.")
        
    # Convert request to DataFrame (using dict() for compatibility with both Pydantic v1 and v2)
    df = pd.DataFrame([post.dict()])
    
    # Extract features
    X = build_features(df)
    
    # Reindex to match the exact columns the model was trained on, filling unseen features with 0
    model_columns = model_bundle['columns']
    X = X.reindex(columns=model_columns, fill_value=0)
    
    # Predict
    model = model_bundle['model']
    prediction = model.predict(X)[0]
    
    return {
        "is_prediction": True,
        "predicted_engagement_rate": round(float(prediction), 2)
    }
