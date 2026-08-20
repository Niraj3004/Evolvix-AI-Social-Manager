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
from features import build_features
import mlflow
import mlflow.types
import mlflow.xgboost
import json

app = FastAPI(title="Evolvix ML Service", version="2.0")

def load_latest_bundle():
    try:
        mlflow.set_experiment("Engagement_Prediction")
        runs = mlflow.search_runs(order_by=["start_time DESC"], max_results=1)
        if not runs.empty:
            run_id = runs.iloc[0].run_id
            model = mlflow.xgboost.load_model(f"runs:/{run_id}/model")
            
            client = mlflow.tracking.MlflowClient()
            local_path = client.download_artifacts(run_id, "model_metadata.json")
            with open(local_path, "r") as f:
                columns = json.load(f)["columns"]
                
            return {"model": model, "columns": columns, "version": run_id}
    except Exception as e:
        print(f"Error loading model from MLflow: {e}")
    return None

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

class RecommendationRequest(BaseModel):
    body: str
    platform: str
    content_type: Optional[str] = "post"

@app.post("/predict/recommendations")
def get_recommendations(req: RecommendationRequest):
    if not model_bundle:
        raise HTTPException(status_code=503, detail="No trained model available.")
        
    from datetime import datetime, timedelta
    
    # Generate candidate posting times for the next 24 hours
    base_time = datetime.now()
    candidates = []
    
    for hour_offset in range(24):
        candidate_time = base_time + timedelta(hours=hour_offset)
        candidates.append({
            "scheduledFor": candidate_time,
            "body": req.body,
            "platform": req.platform,
            "content_type": req.content_type
        })
        
    df_candidates = pd.DataFrame(candidates)
    X_candidates = build_features(df_candidates)
    
    model_columns = model_bundle['columns']
    X_candidates = X_candidates.reindex(columns=model_columns, fill_value=0)
    
    model = model_bundle['model']
    predictions = model.predict(X_candidates)
    
    results = []
    for i, pred in enumerate(predictions):
        results.append({
            "scheduledFor": candidates[i]["scheduledFor"].isoformat(),
            "predicted_engagement_rate": round(float(pred), 2)
        })
        
    # Rank candidates by predicted engagement descending
    results.sort(key=lambda x: x["predicted_engagement_rate"], reverse=True)
    
    return {
        "top_recommendation": results[0],
        "all_ranked_candidates": results[:5] # Return top 5
    }

from fastapi import BackgroundTasks
from training.train import train_model

@app.post("/train")
def trigger_retraining(background_tasks: BackgroundTasks):
    """
    Continuous-learning loop trigger.
    Periodically re-pulls data, retrains, evaluates, and deploys ONLY if it passes the gate.
    """
    background_tasks.add_task(train_model)
    return {"status": "Retraining job started in the background. Model will only be updated if it passes quality gates."}
