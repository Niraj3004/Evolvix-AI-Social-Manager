import os
import json
# pyrefly: ignore [missing-import]
import redis
import pandas as pd
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from typing import Any, Dict

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import load_latest_bundle
from inference import predict_engagement

load_dotenv()

redis_url = os.getenv("REDIS_URL")
if not redis_url:
    raise ValueError("REDIS_URL not set in .env")

# Upstash requires rediss:// or redis://
r = redis.from_url(redis_url, decode_responses=True)
pubsub = r.pubsub()

# Listen to the prediction request channel
pubsub.subscribe("ml.predict.request")

print("Loading model bundle...")
model_bundle = load_latest_bundle()
if not model_bundle:
    print("Warning: No model bundle found. Please run training.")

print("Worker listening for events on 'ml.predict.request'...")

for message in pubsub.listen():
    if isinstance(message, dict) and message.get("type") == "message":
        raw_data = message.get("data")
        if not raw_data or not isinstance(raw_data, (str, bytes, bytearray)):
            continue
            
        data: Dict[str, Any] = json.loads(raw_data)
        
        request_id = data.get("requestId")
        post_data = data.get("post")
        
        if not request_id or not post_data:
            print("Invalid message format.")
            continue
            
        print(f"Received prediction request: {request_id}")
        
        if model_bundle is None:
            error_response = {
                "requestId": request_id,
                "error": "No trained model available"
            }
            r.publish("ml.predict.response", json.dumps(error_response))
            continue
            
        try:
            prediction = predict_engagement(model_bundle, post_data)
            
            response = {
                "requestId": request_id,
                "engagement_rate": round(prediction, 2)
            }
            
            # Publish response back to backend
            r.publish("ml.predict.response", json.dumps(response))
            print(f"Published prediction {response['engagement_rate']} for request {request_id}")
            
        except Exception as e:
            print(f"Error making prediction: {e}")
            err_resp = {
                "requestId": request_id,
                "error": str(e)
            }
            r.publish("ml.predict.response", json.dumps(err_resp))
