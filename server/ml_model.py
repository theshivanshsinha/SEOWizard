# === ml_model.py ===

import joblib
import os
import numpy as np
from bs4 import BeautifulSoup
import requests
from sklearn.feature_extraction.text import TfidfVectorizer

# Load pre-trained SEO regression model (already trained offline)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'seo_model.joblib')
model = joblib.load(MODEL_PATH)

# Same vectorizer used during model training
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'seo_vectorizer.joblib')
vectorizer = joblib.load(VECTORIZER_PATH)

def extract_features(url):
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Textual features
        title = soup.title.string if soup.title else ""
        meta_desc = ""
        for meta in soup.find_all("meta"):
            if meta.get("name", "").lower() == "description":
                meta_desc = meta.get("content", "")

        # Content for NLP
        text = soup.get_text()
        content = f"{title} {meta_desc} {text[:1000]}"

        # Convert content to TF-IDF vector
        X = vectorizer.transform([content])
        return X
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

def predict_seo_score(url):
    X = extract_features(url)
    if X is not None:
        score = model.predict(X)[0]
        return round(float(score), 2)
    else:
        return 0
