import pandas as pd
import sys
import json

from preprocessing.preprocess import preprocess
from weather_api.weather_fetch import get_weather_data
from algorithms.risk_prediction import predict_risk
from algorithms.anomaly_detection import detect_anomalies
from algorithms.rule_engine import apply_rules
from algorithms.risk_fusion import compute_final_risk
from algorithms.safety_decision import compute_safety_decision


# -------------------------------
# 🔥 PRINT TO TERMINAL ONLY
# -------------------------------
def log(msg):
    print(msg, file=sys.stderr)


# -------------------------------
# 🔥 MAKE COLUMNS UNIQUE
# -------------------------------
def make_columns_unique(columns):
    seen = {}
    new_cols = []

    for col in columns:
        if col not in seen:
            seen[col] = 0
            new_cols.append(col)
        else:
            seen[col] += 1
            new_cols.append(f"{col}_{seen[col]}")

    return new_cols


# -------------------------------
# 🔥 LOAD + MERGE ALL SHEETS
# -------------------------------
def load_and_merge_excel(file_path):

    log("Loading Excel file...")

    all_sheets = pd.read_excel(file_path, sheet_name=None)
    merged_df = pd.DataFrame()

    for sheet_name, df in all_sheets.items():

        log(f"Processing sheet: {sheet_name}")

        if df is None or df.empty:
            continue

        df.columns = (
            df.columns.astype(str)
            .str.strip()
            .str.lower()
            .str.replace(" ", "_")
            .str.replace("/", "_")
        )

        df.columns = make_columns_unique(df.columns)
        df = df.reset_index(drop=True)

        if merged_df.empty:
            merged_df = df
        else:
            merged_df = pd.concat([merged_df, df], axis=1)

    merged_df.columns = make_columns_unique(merged_df.columns)

    log(f"Final columns: {merged_df.columns.tolist()}")

    return merged_df


# -------------------------------
# 🚀 MAIN PIPELINE
# -------------------------------
def main():

    try:
        if len(sys.argv) > 1:
            file_path = sys.argv[1]
        else:
            raise Exception("No input file provided")

        log(f"Using file: {file_path}")

        # -------------------------------
        # 1️⃣ LOAD DATA
        # -------------------------------
        df = load_and_merge_excel(file_path)

        # -------------------------------
        # 2️⃣ WEATHER
        # -------------------------------
        log("Fetching weather...")
        weather = get_weather_data(file_path)
        log(f"Weather: {weather}")

        # -------------------------------
        # 3️⃣ PREPROCESS
        # -------------------------------
        log("Preprocessing...")
        df = preprocess(df, weather)

        # -------------------------------
        # 4️⃣ ML
        # -------------------------------
        log("ML Prediction...")
        df = predict_risk(df)

        # -------------------------------
        # 5️⃣ ANOMALY
        # -------------------------------
        log("Detecting anomalies...")
        df = detect_anomalies(df)

        # -------------------------------
        # 6️⃣ RULE ENGINE
        # -------------------------------
        log("Applying rules...")
        df = apply_rules(df)

        # -------------------------------
        # 7️⃣ FINAL RISK
        # -------------------------------
        log("Final fusion...")
        df = compute_final_risk(df)

        # -------------------------------
        # 8️⃣ SAFETY DECISION
        # -------------------------------
        log("Computing safety decision...")
        df = compute_safety_decision(df)

        # -------------------------------
        # ✅ FINAL JSON OUTPUT
        # -------------------------------
        results = []

        for _, row in df.iterrows():
            results.append({
                "final_status": row.get("final_status", "UNKNOWN"),
                "risk_score": int(row.get("risk_score", 0)),
                "entry_decision": row.get("entry_decision", "DENY"),
                "safe_work_time_minutes": int(row.get("safe_work_time_minutes", 0)),
                "risk_reason": row.get("risk_reason", ""),
                "decision_reason": row.get("decision_reason", "")
            })

        # 🔥 ONLY THIS GOES TO BACKEND
        print(json.dumps(results))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


# -------------------------------
# ▶️ RUN
# -------------------------------
if __name__ == "__main__":
    main()