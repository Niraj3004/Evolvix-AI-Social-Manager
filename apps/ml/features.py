import pandas as pd
import re

def extract_hashtags(text):
    if not isinstance(text, str):
        return 0
    return len(re.findall(r'#\w+', text))

def check_cta(text):
    if not isinstance(text, str):
        return 0
    cta_keywords = ['click', 'link', 'bio', 'subscribe', 'follow', 'buy', 'shop', 'read more', 'visit']
    text_lower = text.lower()
    return 1 if any(kw in text_lower for kw in cta_keywords) else 0

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Turns measured posts into a model matrix:
    - hour
    - day-of-week
    - caption length
    - hashtag count
    - has-CTA
    - one-hot platform + content_type
    """
    if df.empty:
        return pd.DataFrame()
        
    df = df.copy()
    
    # 1. Datetime features
    if 'scheduledFor' in df.columns:
        df['scheduledFor'] = pd.to_datetime(df['scheduledFor'])
        df['hour'] = df['scheduledFor'].dt.hour
        df['day_of_week'] = df['scheduledFor'].dt.dayofweek
    else:
        df['hour'] = 12
        df['day_of_week'] = 0
        
    # 2. Text features from 'body'
    if 'body' in df.columns:
        df['caption_length'] = df['body'].apply(lambda x: len(str(x)) if pd.notnull(x) else 0)
        df['hashtag_count'] = df['body'].apply(extract_hashtags)
        df['has_cta'] = df['body'].apply(check_cta)
    else:
        df['caption_length'] = 0
        df['hashtag_count'] = 0
        df['has_cta'] = 0
        
    # 3. One-hot encoding
    if 'platform' in df.columns:
        df['platform'] = df['platform'].astype(str).str.lower()
        platform_dummies = pd.get_dummies(df['platform'], prefix='platform')
        df = pd.concat([df, platform_dummies], axis=1)
        
    if 'content_type' in df.columns:
        df['content_type'] = df['content_type'].astype(str).str.lower()
        content_type_dummies = pd.get_dummies(df['content_type'], prefix='type')
        df = pd.concat([df, content_type_dummies], axis=1)
        
    # Drop original columns
    cols_to_drop = ['scheduledFor', 'body', 'platform', 'content_type']
    df = df.drop(columns=[col for col in cols_to_drop if col in df.columns])
            
    # Ensure all data is numeric
    numeric_df = df.select_dtypes(include=['number', 'bool']).copy()
    for col in numeric_df.columns:
        if numeric_df[col].dtype == 'bool':
            numeric_df[col] = numeric_df[col].astype(int)
            
    return numeric_df
