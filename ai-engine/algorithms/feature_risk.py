def compute_feature_risk(df):

    score = 0

    if "rainfall_risk" in df.columns:
        score += 0.2 * (df["rainfall_risk"] / 100)

    if "weather_risk" in df.columns:
        score += 0.25 * df["weather_risk"]

    if "maintenance_risk" in df.columns:
        score += 0.2 * df["maintenance_risk"]

    if "worker_exposure" in df.columns:
        score += 0.15 * (df["worker_exposure"] / 500)

    if "ventilation_condition" in df.columns:
        score += 0.2 * (df["ventilation_condition"] / 3)

    df["feature_risk_score"] = score.clip(0, 1)

    return df
