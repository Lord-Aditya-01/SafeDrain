import { Outlet } from "react-router-dom";
import SupervisorNavbar from "../../components/supervisor/SupervisorNavbar";
import SupervisorFooter from "../../components/supervisor/SupervisorFooter";

const SupervisorLayout = () => {
  return (
    <div className="supervisor-dashboard">
      <SupervisorNavbar />

      <div className="supervisor-content">
        <Outlet />
      </div>

      <SupervisorFooter />
    </div>
  );
};

export default SupervisorLayout;
