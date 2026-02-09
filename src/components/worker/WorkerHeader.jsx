import { useNavigate } from "react-router-dom";
import socket from "../../socket";

const WorkerHeader = ({ worker }) => {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Notify backend
    socket.emit("worker-logout");

    // Disconnect socket session
    socket.disconnect();

    // Redirect
    navigate("/");
  };

  return (
    <div className="worker-card worker-header">

      <div>
        <h2>{worker?.name || "Worker"}</h2>

        <p>ID: {worker?.workerId || "N/A"}</p>

        {worker?.status === "EMERGENCY" && (
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
