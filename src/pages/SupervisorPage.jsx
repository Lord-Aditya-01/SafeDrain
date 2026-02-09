import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import SupervisorDashboard from "../components/supervisor/SupervisorDashboard";
import socket from "../socket";

const SupervisorPage = () => {

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {

    socket.emit("check-supervisor-auth");

    socket.once("supervisor-auth-result", (result) => {
      setIsAuth(result);
    });

  }, []);

  if (isAuth === null) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/supervisor-login" />;
  }

  return <SupervisorDashboard />;
};

export default SupervisorPage;
