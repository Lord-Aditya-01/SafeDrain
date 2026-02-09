import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/supervisor/supervisor.css";
import socket from "../socket";

const SupervisorLogin = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    // 🚀 Send login request to backend
    socket.emit("supervisor-login", {
      username,
      password
    });

    // Listen for response
    socket.once("supervisor-login-success", () => {
      navigate("/supervisor");
    });

    socket.once("supervisor-login-failed", () => {
      alert("Invalid Supervisor credentials");
    });
  };

  return (
    <div className="supervisor-login-container">

      <form className="supervisor-login-card" onSubmit={handleLogin}>

        <h2>Supervisor Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

      </form>

    </div>
  );
};

export default SupervisorLogin;
