import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import WorkerDashboard from "../components/worker/WorkerDashboard";
import socket from "../socket";

const WorkerPage = () => {
  const [isAuth, setIsAuth] = useState(null); // null = loading
  useEffect(() => {

    // Ask backend if worker session exists
    socket.emit("check-worker-auth");

    socket.once("worker-auth-result", (result) => {
      setIsAuth(result); // true or false
    });

  }, []);

  // Prevent flicker while checking
  if (isAuth === null) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return <WorkerDashboard />;
};

export default WorkerPage;
