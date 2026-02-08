import { useEffect, useState } from "react";

const GasStatus = () => {
  const [oxygen, setOxygen] = useState(20.9);
  const [toxic, setToxic] = useState(10);
  const [status, setStatus] = useState("SAFE");

  useEffect(() => {
    const interval = setInterval(() => {
      // 🔧 Simulated sensor values
      const newOxygen = +(18 + Math.random() * 3).toFixed(1); // 18–21
      const newToxic = Math.floor(Math.random() * 100);       // 0–100

      setOxygen(newOxygen);
      setToxic(newToxic);

      // 🧮 Emergency logic
      if (newOxygen < 19.5 || newToxic > 60) {
        setStatus("EMERGENCY");
        localStorage.setItem("workerStatus", "EMERGENCY");
      } else if (newOxygen < 20.5 || newToxic > 30) {
        setStatus("WARNING");
        localStorage.setItem("workerStatus", "WARNING");
      } else {
        setStatus("SAFE");
        localStorage.setItem("workerStatus", "NORMAL");
      }
    }, 5000); // update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
  <div className="worker-card">
    <h3 className="gas-heading">🧪 Gas Levels</h3>


   <p className="gas-text">
  <span className="gas-label">Oxygen:</span>{" "}
  <strong>{oxygen}%</strong>
</p>

<p className="gas-text">
  <span className="gas-label">Toxic Gas Index:</span>{" "}
  <strong>{toxic}</strong>
</p>



    {/* STATUS DISPLAY */}
    <div className={`status-badge status-${status.toLowerCase()}`}>
    {status === "EMERGENCY" ? (
      <div className="emergency-box">
        <div className="emergency-text">
          🚨 EMERGENCY
        </div>
      </div>
    ) : (
      <p>
        Status:{" "}
        <span
          style={{
            color: status === "WARNING" ? "orange" : "green",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      </p>
    )}
    </div>
  </div>
);

};

export default GasStatus;
