import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/worker/worker.css";
import socket from "../socket";

const WorkerLogin = () => {

  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {

    e.preventDefault();

    // 🚀 Send login request to backend
    socket.emit("worker-login", {
      workerId,
      password
    });

    // Success response
    socket.once("worker-login-success", () => {
      navigate("/worker");
    });

    // Failed response
    socket.once("worker-login-failed", () => {
      alert("Invalid Worker credentials");
    });

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
          <span onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>

      </form>

    </div>
  );
};

export default WorkerLogin;
