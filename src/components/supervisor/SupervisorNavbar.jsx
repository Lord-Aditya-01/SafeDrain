import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import { NavLink } from "react-router-dom";

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
        <button onClick={() => navigate("/supervisor/dashboard")}>
          Dashboard
        </button>

        <NavLink to="/supervisor/workers">
          <button>Workers</button>
        </NavLink>

        <button onClick={() => navigate("/supervisor/alerts")}>
          Alerts
        </button>

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
