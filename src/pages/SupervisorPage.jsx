import { Navigate } from "react-router-dom";
import SupervisorDashboard from "../components/supervisor/SupervisorDashboard";

const SupervisorPage = () => {
  const isLoggedIn = localStorage.getItem("isSupervisorLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/supervisor-login" />;
  }

  return <SupervisorDashboard />;
};

export default SupervisorPage;
