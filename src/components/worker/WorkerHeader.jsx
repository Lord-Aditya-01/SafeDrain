import { useNavigate } from "react-router-dom";
import socket from "../../socket";

const WorkerHeader = ({ worker }) => {

  const navigate = useNavigate();

  // ✅ fallback to localStorage if prop not provided
  const currentWorker = worker ?? JSON.parse(localStorage.getItem("worker"));
  console.log("Current Worker:",  currentWorker);
  
  const handleLogout = () => {
    socket.emit("worker-logout");
    // optional but recommended cleanup
    localStorage.removeItem("worker");

    navigate("/");
  };

  return (
    <div className="worker-card worker-header">

      <div>
        <h2>{currentWorker?.name || "Worker"}</h2>

        <p>ID: {currentWorker?.workerId || currentWorker?.id || "N/A"}</p>

        {currentWorker?.status === "EMERGENCY" && (
          <p style={{ color: "red", fontWeight: "bold", fontSize: "13px" }}>
            🚨 EMERGENCY MODE
          </p>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
};

export default WorkerHeader;
