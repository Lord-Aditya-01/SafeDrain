import joblib
import pandas as pd

model = joblib.load("models/risk_model.pkl")
model_features = joblib.load("models/model_features.pkl")


def predict_risk(df):

    features = df.select_dtypes(include=["float64", "int64"])

    features = features.fillna(0)

    # ✅ ADD MISSING FEATURES
    for col in model_features:
        if col not in features:
            features[col] = 0

    # ✅ REMOVE EXTRA
    features = features[model_features]

    print("\n🧠 Features used:\n", features.columns.tolist())

    preds = model.predict(features)
    probs = model.predict_proba(features)

    df["ml_prediction"] = preds
    df["ml_confidence"] = probs.max(axis=1)

    return df
