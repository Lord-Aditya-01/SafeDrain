import pandas as pd


def preprocess(df, weather):
    print("🧹 Starting preprocessing...")

    # -------------------------------
    # ✅ NORMALIZE COLUMN NAMES
    # -------------------------------
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("/", "_")
    )

    # -------------------------------
    # ✅ REMOVE DUPLICATE COLUMNS (EXTRA SAFETY)
    # -------------------------------
    df = df.loc[:, ~df.columns.duplicated()]

    # -------------------------------
    # ✅ CLEAN STRING VALUES (SAFE)
    # -------------------------------
    df = df.apply(
        lambda col: col.map(lambda x: x.strip().lower() if isinstance(x, str) else x)
    )

    # -------------------------------
    # ✅ ADD WEATHER DATA
    # -------------------------------
    if weather:
        df["temperature_c"] = weather.get("temperature_c", 30)
        df["humidity_percent"] = weather.get("humidity_percent", 50)
        df["rainfall_last_24h_mm"] = weather.get("rainfall_last_24h_mm", 0)

    # -------------------------------
    # ✅ DEFAULT VALUES
    # -------------------------------
    defaults = {
        "gas_level_ppm": 0,
        "oxygen_level_percent": 20.9,
        "water_level_condition": "normal",
        "temperature_c": 30,
        "humidity_percent": 50,
        "number_of_workers": 1,
        "expected_work_duration_minutes": 30,
        "sewer_depth_m": 1,
        "ventilation_condition": "good",
        "past_incidents": 0,
        "maintenance_gap_days": 0,
        "worker_exposure": 1,
    }

    for col, val in defaults.items():
        if col not in df.columns:
            df[col] = val

    # -------------------------------
    # ✅ TEXT → NUMERIC
    # -------------------------------
    df["ventilation_condition"] = (
        df["ventilation_condition"].map({"good": 1, "moderate": 1, "poor": 2}).fillna(1)
    )

    df["water_level_condition"] = (
        df["water_level_condition"].map({"normal": 1, "medium": 2, "high": 3}).fillna(1)
    )

    if "visible_gas_odor" in df.columns:
        df["visible_gas_odor"] = (
            df["visible_gas_odor"].map({"yes": 1, "no": 0}).fillna(0)
        )

    if "safety_equipment_available" in df.columns:
        df["safety_equipment_available"] = (
            df["safety_equipment_available"].map({"yes": 1, "no": 0}).fillna(1)
        )

    # -------------------------------
    # ✅ NUMERIC CLEANING (SAFE)
    # -------------------------------
    numeric_cols = [
        "gas_level_ppm",
        "oxygen_level_percent",
        "rainfall_last_24h_mm",
        "temperature_c",
        "humidity_percent",
        "number_of_workers",
        "expected_work_duration_minutes",
        "sewer_depth_m",
        "past_incidents",
        "maintenance_gap_days",
        "worker_exposure",
    ]

    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # -------------------------------
    # ✅ FIX UNITS (300mm → 300)
    # -------------------------------
    if "sewer_diameter" in df.columns:
        df["sewer_diameter"] = df["sewer_diameter"].astype(str).str.replace("mm", "")
        df["sewer_diameter"] = pd.to_numeric(
            df["sewer_diameter"], errors="coerce"
        ).fillna(0)

    # -------------------------------
    # ✅ FEATURE ENGINEERING
    # -------------------------------
    df["gas_oxygen_ratio"] = df["gas_level_ppm"] / (df["oxygen_level_percent"] + 1)

    df["rain_water_risk"] = df["rainfall_last_24h_mm"] * df["water_level_condition"]

    df["maintenance_risk"] = df["maintenance_gap_days"] * (df["past_incidents"] + 1)

    df["worker_risk"] = df["number_of_workers"] * df["worker_exposure"]

    # -------------------------------
    # 🔥 ADVANCED FEATURES
    # -------------------------------

    df["oxygen_deficit"] = 21 - df["oxygen_level_percent"]

    df["exposure_risk"] = df["number_of_workers"] * df["expected_work_duration_minutes"]

    df["combined_risk"] = df["gas_level_ppm"] * df["ventilation_condition"]
    # -------------------------------
    # ✅ FINAL FEATURES (MATCH MODEL)
    # -------------------------------
    required_columns = [
        "gas_level_ppm",
        "oxygen_level_percent",
        "water_level_condition",
        "rainfall_last_24h_mm",
        "temperature_c",
        "humidity_percent",
        "number_of_workers",
        "expected_work_duration_minutes",
        "sewer_depth_m",
        "ventilation_condition",
        "past_incidents",
        "maintenance_gap_days",
        "worker_exposure",
    ]

    for col in required_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[required_columns]

    print("\n✅ Preprocessing completed")
    print("📊 Final columns:\n", df.columns.tolist())

    return df
