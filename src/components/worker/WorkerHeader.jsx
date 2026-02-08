import { useNavigate } from "react-router-dom";

const WorkerHeader = () => {
  const navigate = useNavigate();
  const worker = JSON.parse(localStorage.getItem("workerData"));

  const handleLogout = () => {
  localStorage.removeItem("workerAuth");
  localStorage.removeItem("workerStatus");
  localStorage.removeItem("manholeStartTime");
  navigate("/");
};


  return (
    <div className="worker-card worker-header">
      <div>
        <h2>{worker?.name || "Worker"}</h2>
        <p>ID: {worker?.workerId || "N/A"}</p>
        {localStorage.getItem("workerStatus") === "EMERGENCY" && (
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
