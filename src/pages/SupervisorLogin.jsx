import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/supervisor/supervisor.css";

const SupervisorLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Prototype credentials
    if (username === "supervisor" && password === "admin123") {
      localStorage.setItem("isSupervisorLoggedIn", "true");
      navigate("/supervisor");
    } else {
      alert("Invalid Supervisor credentials");
    }
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
