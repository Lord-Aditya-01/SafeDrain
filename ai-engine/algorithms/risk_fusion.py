def compute_final_risk(df):

    final_status = []
    risk_score = []
    reason = []

    for _, row in df.iterrows():

        # -------------------------------
        # 🚨 1. HARD SAFETY RULES (NON-NEGOTIABLE)
        # -------------------------------
        oxygen = row.get("oxygen_level_percent", 21)
        gas = row.get("gas_level_ppm", 0)
        water = row.get("water_level_condition", 1)
        ventilation = row.get("ventilation_condition", 1)

        if oxygen < 17:
            final_status.append("DANGER")
            risk_score.append(100)
            reason.append("Critical: Oxygen below survival level")
            continue

        if gas > 120:
            final_status.append("DANGER")
            risk_score.append(100)
            reason.append("Critical: Extremely high gas")
            continue

        if water == 3 and gas > 40:
            final_status.append("DANGER")
            risk_score.append(95)
            reason.append("Flooded sewer + gas accumulation")
            continue

        # -------------------------------
        # ⚠️ 2. RULE ENGINE PRIORITY
        # -------------------------------
        if row.get("rule_status") == "DANGER":
            final_status.append("DANGER")
            risk_score.append(85)
            reason.append("Rule Engine Triggered")
            continue

        # -------------------------------
        # 🧠 3. ML + CONFIDENCE
        # -------------------------------
        ml_pred = row.get("ml_prediction", 0)
        confidence = row.get("ml_confidence", 0)

        # Default fallback
        current_status = "SAFE"
        current_score = 20
        current_reason = "Normal Conditions"

        if ml_pred == 2:  # DANGER
            if confidence > 0.75:
                current_status = "DANGER"
                current_score = int(75 + confidence * 20)
                current_reason = "ML High Confidence Danger"
            else:
                current_status = "ALERT"
                current_score = int(55 + confidence * 20)
                current_reason = "ML Low Confidence Danger"

        elif ml_pred == 1:  # ALERT
            current_status = "ALERT"
            current_score = int(45 + confidence * 20)
            current_reason = "ML Alert"

        else:  # SAFE
            if confidence < 0.5:
                current_status = "ALERT"
                current_score = 40
                current_reason = "Low Confidence Safe"
            else:
                current_status = "SAFE"
                current_score = int(15 + confidence * 15)
                current_reason = "Safe Conditions"

        # -------------------------------
        # ⚠️ 4. ANOMALY BOOST
        # -------------------------------
        if row.get("anomaly_flag", 0) == 1:
            if current_status == "SAFE":
                current_status = "ALERT"
                current_score += 15
                current_reason += " + Anomaly"
            elif current_status == "ALERT":
                current_score += 10
                current_reason += " + Anomaly"

        # -------------------------------
        # ⚠️ 5. ENVIRONMENTAL RISK BOOST
        # -------------------------------
        if ventilation == 2 and gas > 40:
            current_status = "DANGER"
            current_score = max(current_score, 85)
            current_reason = "Poor Ventilation + Gas Risk"

        if row.get("past_incidents", 0) > 2:
            current_score += 5
            current_reason += " + High Incident History"

        if row.get("maintenance_gap_days", 0) > 60:
            current_score += 5
            current_reason += " + Poor Maintenance"

        # -------------------------------
        # 📊 6. NORMALIZE SCORE
        # -------------------------------
        current_score = min(100, max(0, current_score))

        # Save
        final_status.append(current_status)
        risk_score.append(current_score)
        reason.append(current_reason)

    # -------------------------------
    # SAVE RESULTS
    # -------------------------------
    df["final_status"] = final_status
    df["risk_score"] = risk_score
    df["risk_reason"] = reason

    return df
