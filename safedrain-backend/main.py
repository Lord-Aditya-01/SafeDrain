from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import shutil
import sys, os

# Access ai-engine
sys.path.append(os.path.abspath("../ai-engine"))

from preprocessing.preprocess import preprocess
from algorithms.risk_prediction import predict_risk
from algorithms.anomaly_detection import detect_anomalies
from algorithms.rule_engine import apply_rules
from algorithms.risk_fusion import compute_final_risk
from algorithms.safety_decision import compute_safety_decision

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔥 NEW API (FILE UPLOAD)
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    file_path = f"temp_{file.filename}"

    # Save file temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read Excel
    df = pd.read_excel(file_path)

    weather = {
        "temperature_c": 30,
        "humidity_percent": 50,
        "rainfall_last_24h_mm": 0,
    }

    # Run pipeline
    df = preprocess(df, weather)
    df = predict_risk(df)
    df = detect_anomalies(df)
    df = apply_rules(df)
    df = compute_final_risk(df)
    df = compute_safety_decision(df)

    return df.to_dict(orient="records")
