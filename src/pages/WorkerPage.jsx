import { Navigate } from "react-router-dom";
import WorkerDashboard from "../components/worker/WorkerDashboard";

const WorkerPage = () => {
  const isLoggedIn = localStorage.getItem("isWorkerLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <WorkerDashboard />;
};

export default WorkerPage;
