import sys
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import get_db
from features import build_features
from evaluation import evaluate_mae
from registry import save_model_bundle, load_latest_bundle

THRESHOLD_MAE = 5.0 # Example threshold

def get_training_data():
    db = next(get_db())
    # Pull real analytics data joined with the scheduled post content
    query = """
        SELECT 
            sp."scheduledFor", 
            c."body", 
            c."platform", 
            a."reach", 
            a."likes", 
            a."comments"
        FROM "Analytics" a
        JOIN "ScheduledPost" sp ON a."scheduledPostId" = sp."id"
        JOIN "Content" c ON sp."contentId" = c."id"
    """
    df = pd.read_sql(query, db.connection())
    
    if df.empty:
        raise ValueError("No analytics data found for training.")
        
    # Engagement rate = (likes + comments) / reach as percentage
    df['engagement_rate'] = ((df['likes'] + df['comments']) / df['reach'].replace(0, 1)) * 100
    df['engagement_rate'] = df['engagement_rate'].fillna(0)
    
    y = df['engagement_rate']
    X = build_features(df)
    
    return X, y

def train_model():
    print("Fetching and preparing data...")
    X, y = get_training_data()
    
    print(f"Data shape: {X.shape}")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Regressor...")
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating...")
    y_pred = model.predict(X_test)
    mae = evaluate_mae(y_test, y_pred)
    
    print(f"Model MAE: {mae:.4f}")
    
    latest_bundle = load_latest_bundle()
    
    if latest_bundle:
        previous_mae = latest_bundle.get('metric', float('inf'))
        print(f"Previous best MAE: {previous_mae:.4f}")
        
        if mae >= previous_mae:
            raise Exception(f"New model MAE ({mae:.4f}) is not better than the previous best ({previous_mae:.4f}). Keeping previous model.")
            
    if mae > THRESHOLD_MAE:
         raise Exception(f"New model MAE ({mae:.4f}) did not meet the strict quality threshold ({THRESHOLD_MAE}). Model rejected.")
    
    print("Model passed all checks. Saving to registry...")
    bundle_path = save_model_bundle(model, list(X.columns), mae)
    print(f"Model successfully saved at {bundle_path}")

if __name__ == "__main__":
    try:
        train_model()
    except Exception as e:
        print(f"Training stopped: {str(e)}")
