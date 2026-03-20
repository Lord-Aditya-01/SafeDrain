import { useEffect, useState } from "react";
import WorkersMap from "./WorkersMap";
import WorkerList from "./WorkerList";
import "./supervisor.css";
import socket from "../../socket";

const SupervisorDashboard = () => {

  const [workers, setWorkers] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);

  // 🔥 AI STATES
  const [aiResults, setAiResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // 🔌 SOCKET + LIVE WORKERS
  // ===============================
  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-supervisor");

    const handleInitialWorkers = (data) => {
      if (!Array.isArray(data)) return;

      const formatted = {};
      data.forEach(worker => {
        if (worker?.id) formatted[worker.id] = worker;
      });

      setWorkers(formatted);
    };

    const handleLocation = (data) => {
      if (!data?.id) return;

      setWorkers(prev => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          ...data
        }
      }));
    };

    const handleOffline = ({ workerId }) => {
      setWorkers(prev => {
        const copy = { ...prev };
        delete copy[workerId];
        return copy;
      });
    };

    socket.on("initial-workers", handleInitialWorkers);
    socket.on("receive-location", handleLocation);
    socket.on("worker-offline", handleOffline);

    return () => {
      socket.off("initial-workers", handleInitialWorkers);
      socket.off("receive-location", handleLocation);
      socket.off("worker-offline", handleOffline);
    };

  }, []);

  // ===============================
  // 📁 FILE UPLOAD → AI ENGINE
  // ===============================
  const handleUpload = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/ai/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setAiResults(data);

    } catch (err) {
      alert("AI processing failed");
    }

    setLoading(false);
  };

  // ===============================
  // 🎨 SUMMARY STYLE
  // ===============================
  const cardStyle = (color) => ({
    flex: 1,
    background: "#020617",
    padding: "18px",
    borderRadius: "12px",
    borderLeft: `6px solid ${color}`,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  });

  // ===============================
  // 🎯 UI
  // ===============================
  return (
    <div className="supervisor-dashboard">

      {/* ===============================
          📁 FILE UPLOAD
      =============================== */}
      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={handleUpload} />

        {loading && (
          <p style={{ marginTop: "10px" }}>
            🧠 AI Analyzing Data...
          </p>
        )}
      </div>

      {/* ===============================
          📊 AI SUMMARY
      =============================== */}
      {aiResults.length > 0 && (
        <div style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px"
        }}>
          <div style={cardStyle("#22c55e")}>
            SAFE: {aiResults.filter(r => r.final_status === "SAFE").length}
          </div>

          <div style={cardStyle("#f59e0b")}>
            ALERT: {aiResults.filter(r => r.final_status === "ALERT").length}
          </div>

          <div style={cardStyle("#ef4444")}>
            DANGER: {aiResults.filter(r => r.final_status === "DANGER").length}
          </div>
        </div>
      )}

      {/* ===============================
          📊 AI RESULT CARDS
      =============================== */}
      <div>
        {aiResults.map((item, index) => {

          const color =
            item.final_status === "DANGER"
              ? "#ef4444"
              : item.final_status === "ALERT"
              ? "#f59e0b"
              : "#22c55e";

          return (
            <div
              key={index}
              style={{
                background: "#020617",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                borderLeft: `6px solid ${color}`,
                color: "white"
              }}
            >

              <h3 style={{ color }}>{item.final_status}</h3>

              <p>📊 Risk Score: {item.risk_score}</p>

              <p>
                🚪 Entry:
                <span style={{ color, fontWeight: "bold" }}>
                  {" "}{item.entry_decision}
                </span>
              </p>

              <p>⏱ Safe Time: {item.safe_work_time_minutes} min</p>

              <hr style={{ borderColor: "#1e293b" }} />

              <p>🧠 {item.risk_reason}</p>
              <p>📌 {item.decision_reason}</p>

            </div>
          );
        })}
      </div>

      {/* ===============================
          🧠 AI EXPLANATION
      =============================== */}
      {aiResults.length > 0 && (
        <div style={{
          background: "#020617",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
          color: "white"
        }}>
          <h3>🧠 AI Explanation</h3>
          <ul>
            <li>Analyzes gas, oxygen, water & environment</li>
            <li>Uses ML + rules + anomaly detection</li>
            <li>Predicts risk level & safe time</li>
            <li>Automatically allows or denies entry</li>
          </ul>
        </div>
      )}

      {/* ===============================
          🗺️ LIVE TRACKING
      =============================== */}
      <div className="supervisor-content">

        <div className="supervisor-map">
          <WorkersMap
            workers={Object.values(workers)}
            selectedWorker={selectedWorker}
          />
        </div>

        <div className="supervisor-panel">
          <WorkerList
            workers={Object.values(workers)}
            onSelect={setSelectedWorker}
          />
        </div>

      </div>

      <div style={{ marginTop: "10px" }}>
        Live Tracking Active
      </div>

    </div>
  );
};

export default SupervisorDashboard;