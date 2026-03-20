def apply_rules(df):

    status = []
    reason = []

    for _, row in df.iterrows():

        # 🚨 HARD RULES (NEVER IGNORE)

        if row["oxygen_level_percent"] < 18:
            status.append("DANGER")
            reason.append("Low Oxygen")
            continue

        if row["gas_level_ppm"] > 100:
            status.append("DANGER")
            reason.append("Extreme Gas Level")
            continue

        if row["ventilation_condition"] == 2 and row["gas_level_ppm"] > 40:
            status.append("DANGER")
            reason.append("Poor Ventilation + Gas")
            continue

        if row["water_level_condition"] == 3:
            status.append("DANGER")
            reason.append("High Water Level")
            continue

        # ⚠️ fallback
        status.append("CHECK")
        reason.append("ML Decision")

    df["rule_status"] = status
    df["rule_reason"] = reason

    return df
