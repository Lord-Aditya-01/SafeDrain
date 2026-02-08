import WorkerHeader from "./WorkerHeader";
import LocationMap from "./LocationMap";
import GasStatus from "./GasStatus";
import SOSButton from "./SOSButton";
import WorkStatus from "./WorkStatus";
import "./worker.css";
import { useEffect } from "react";
import socket from "../../socket";

const WorkerDashboard = () => {

  const workerId = "W001"; // later get from login/session
  useEffect(() => {
    // Join as worker
    socket.emit("join-worker", workerId);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const locationData = {
          workerId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        socket.emit("send-location", locationData);

      },

      (err) => {
        console.error("Location error:", err);
      },

      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    // cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };

  }, []);

  return (
    <div className="worker-dashboard">
      <div className="worker-container">
        <WorkerHeader />
        <LocationMap />
        <GasStatus />
        <SOSButton />
        <WorkStatus />
        <div>Worker Tracking Active</div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
