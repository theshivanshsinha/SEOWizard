import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
import joblib

# Load and prepare the data
df = pd.read_csv("bioverse\src\seo_data.csv")
df["text"] = df["title"] + " " + df["meta"] + " " + df["content"]

X_text = df["text"]
y = df["seo_score"]

# Vectorize and train
vectorizer = TfidfVectorizer(max_features=1000)
X = vectorizer.fit_transform(X_text)

model = LinearRegression()
model.fit(X, y)

# Save model and vectorizer
joblib.dump(model, "seo_model.joblib")
joblib.dump(vectorizer, "seo_vectorizer.joblib")
print("✅ Model and vectorizer saved successfully.")
