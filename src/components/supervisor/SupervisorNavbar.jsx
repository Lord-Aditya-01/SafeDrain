import { useNavigate } from "react-router-dom";

const SupervisorNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("supervisorAuth");
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
