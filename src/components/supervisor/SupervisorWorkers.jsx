import { useEffect, useState } from "react";
import socket from "../../socket";

const SupervisorWorkers = () => {

  const [workers, setWorkers] = useState([]);

  useEffect(() => {

    socket.emit("join-supervisor");

    socket.on("initial-workers", (data) => {
      setWorkers(data || []);
    });

    socket.on("receive-location", (data) => {

      setWorkers(prev => {
        const exists = prev.find(w => w.id === data.id);

        if (exists) {
          return prev.map(w =>
            w.id === data.id ? { ...w, ...data } : w
          );
        }

        return [...prev, data];
      });

    });

    socket.on("worker-offline", ({ workerId }) => {
      setWorkers(prev => prev.filter(w => w.id !== workerId));
    });

    return () => {
      socket.off("initial-workers");
      socket.off("receive-location");
      socket.off("worker-offline");
    };

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px" }}>Active Workers</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
        gap: "16px"
      }}>

        {workers.map(worker => (

          <div
            key={worker.id}
            style={{
              background: "#020617",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #1e293b",
              boxShadow: "0 0 12px rgba(0,0,0,0.4)"
            }}
          >

            <h3 style={{ marginBottom: "8px" }}>
              👷 {worker.name}
            </h3>

            <p><strong>ID:</strong> {worker.id}</p>

            <p><strong>Contact:</strong> {worker.mobile || "N/A"}</p>

            <p><strong>Emergency Contact:</strong> {worker.emergencyContact || "N/A"}</p>

            <p>
              <strong>Status:</strong>
              <span style={{
                marginLeft: "6px",
                color:
                  worker.status === "EMERGENCY"
                    ? "red"
                    : worker.status === "WARNING"
                    ? "orange"
                    : "lime"
              }}>
                {worker.status}
              </span>
            </p>

            <p><strong>Work Status:</strong> {worker.workStatus}</p>

            <hr style={{ margin: "10px 0", opacity: 0.2 }} />

            <p>🧪 Oxygen: {worker.oxygen ?? "--"}</p>
            <p>☣️ Toxic Gas: {worker.toxic ?? "--"}</p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default SupervisorWorkers;
