import pandas as pd
from features import build_features

def predict_engagement(model_bundle, post_data: dict) -> float:
    """
    Takes a single post dictionary and returns the predicted engagement rate.
    """
    df = pd.DataFrame([post_data])
    X = build_features(df)
    
    model_columns = model_bundle['columns']
    # Align features with training columns
    X = X.reindex(columns=model_columns, fill_value=0)
    
    model = model_bundle['model']
    prediction = model.predict(X)[0]
    
    return float(prediction)
