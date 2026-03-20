from sklearn.ensemble import IsolationForest


def detect_anomalies(df):

    features = df.select_dtypes(include=["float64", "int64"])

    model = IsolationForest(contamination=0.03, n_estimators=200, random_state=42)

    model.fit(features)

    preds = model.predict(features)

    df["anomaly_flag"] = [1 if x == -1 else 0 for x in preds]

    return df
