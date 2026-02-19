import { useEffect, useState } from "react";
import socket from "../../socket";

const SupervisorWorkers = () => {

  const [workers, setWorkers] = useState({});
  const [search, setSearch] = useState("");

  // Join supervisor room
  useEffect(() => {

    socket.emit("join-supervisor");

    const handleInitialWorkers = (data) => {

      const formatted = {};

      data.forEach(worker => {
        formatted[worker.id] = worker;
      });

      setWorkers(formatted);
    };

    const handleUpdate = (data) => {

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
    socket.on("receive-location", handleUpdate);
    socket.on("worker-offline", handleOffline);

    return () => {
      socket.off("initial-workers");
      socket.off("receive-location");
      socket.off("worker-offline");
    };

  }, []);

  // ⭐ SEARCH FILTER
  const filteredWorkers = Object.values(workers).filter(worker =>
    worker.name?.toLowerCase().includes(search.toLowerCase()) ||
    worker.workerId?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div style={{ padding: "20px" }}>

      <h2>Active Workers</h2>

      {/* 🔥 SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px",
          borderRadius: "8px"
        }}
      />

      {filteredWorkers.map(worker => (

        <div key={worker.id} className="worker-card">

          <h3>👷 {worker.name}</h3>

          <p>ID: {worker.workerId}</p>
          <p>Contact: {worker.mobile || "N/A"}</p>
          <p>Emergency Contact: {worker.emergencyContact || "N/A"}</p>

          <p>Status:
            <span style={{ color: worker.status === "EMERGENCY" ? "red" : "green" }}>
              {" "}{worker.status}
            </span>
          </p>

          <p>Work Status: {worker.workStatus}</p>

          {worker.oxygen && <p>🧪 Oxygen: {worker.oxygen}</p>}
          {worker.toxic && <p>☣ Toxic Gas: {worker.toxic}</p>}

        </div>

      ))}

    </div>
  );

};

export default SupervisorWorkers;
