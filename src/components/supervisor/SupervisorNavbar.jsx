import { useNavigate } from "react-router-dom";
import socket from "../../socket";

const SupervisorNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    // Notify server supervisor is leaving
    socket.emit("supervisor-logout");

    // Disconnect socket (clean session)
    socket.disconnect();

    // Redirect to login
    navigate("/supervisor-login");
  };

  return (
    <div className="supervisor-navbar">
      <div className="nav-left">
        👷 SafeDrain Supervisor
      </div>

      <div className="nav-right">
        <button>Dashboard</button>
        <button>Workers</button>
        <button>Alerts</button>
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SupervisorNavbar;
