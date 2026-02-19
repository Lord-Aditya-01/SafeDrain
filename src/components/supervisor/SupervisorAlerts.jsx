import { useEffect, useState } from "react";
import socket from "../../socket";

const SupervisorAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    const handleNewAlert = (alert) => {
      setAlerts(prev => [alert, ...prev]);
    };

    socket.on("new-alert", handleNewAlert);

    return () => {
      socket.off("new-alert", handleNewAlert);
    };

  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>🚨 Alerts</h2>

      {alerts.length === 0 && <p>No alerts yet</p>}

      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            background: "#1e293b",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <strong>{alert.type}</strong>
          <br />
          Worker ID: {alert.workerId}
          <br />
          {alert.message}
          <br />
          {new Date(alert.time).toLocaleTimeString()}
        </div>
      ))}
    </div>
  );
};

export default SupervisorAlerts;
