import os
import joblib

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
LATEST_PTR = os.path.join(MODEL_DIR, 'latest.txt')

os.makedirs(MODEL_DIR, exist_ok=True)

def save_model_bundle(model, columns, metric):
    import time
    version = int(time.time())
    bundle = {
        'model': model,
        'columns': columns,
        'metric': metric,
        'version': version
    }
    
    filename = f"model_v{version}.joblib"
    filepath = os.path.join(MODEL_DIR, filename)
    joblib.dump(bundle, filepath)
    
    # Update latest pointer
    with open(LATEST_PTR, 'w') as f:
        f.write(filename)
        
    return filepath

def load_latest_bundle():
    if not os.path.exists(LATEST_PTR):
        return None
    with open(LATEST_PTR, 'r') as f:
        filename = f.read().strip()
    
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        return None
        
    return joblib.load(filepath)
