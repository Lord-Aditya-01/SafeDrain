import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/worker/worker.css";

const WorkerLogin = () => {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  const storedWorker = JSON.parse(localStorage.getItem("workerData"));

  if (!storedWorker) {
    alert("No worker found. Please sign up first.");
    return;
  }

  if (
  workerId === storedWorker.workerId &&
  password === storedWorker.password
) {
  localStorage.setItem("isWorkerLoggedIn", "true");
  navigate("/worker");
}

};



  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">Worker Login</h2>
        
        <input
          type="text"
          placeholder="Worker ID"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password / PIN"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-btn">
          Login
        </button>
        <p className="login-link">
        New worker?{" "}
        <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>

      </form>
    </div>
  );
};

export default WorkerLogin;
