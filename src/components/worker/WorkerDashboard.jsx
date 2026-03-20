import WorkerHeader from "./WorkerHeader";
import LocationMap from "./LocationMap";
import SOSButton from "./SOSButton";
import WorkStatus from "./WorkStatus";
import GasStatus from "./GasStatus"; // ✅ missing import
import "./worker.css";
import { useEffect, useState } from "react";
import socket from "../../socket";
import ManholeNavigator from "./ManholeNavigator";

const WorkerDashboard = () => {
  const [position, setPosition] = useState([18.6770, 73.8987]);
  const [manholes, setManholes] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {

    const localWorker = localStorage.getItem("worker");

    if (localWorker) {
      setWorker(JSON.parse(localWorker));
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("get-worker-session");

    const handleWorkerUpdate = (data) => {
      if (!data) return;

      setWorker(data);
      localStorage.setItem("worker", JSON.stringify(data));
    };

    socket.on("worker-session-data", handleWorkerUpdate);

    return () => {
      socket.off("worker-session-data", handleWorkerUpdate);
    };

  }, []);

  if (!worker) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px"
      }}>
        👷 Loading Worker Dashboard...
      </div>
    );
  }

  return (
    <div className="worker-dashboard">

      <div className="worker-container">

        <WorkerHeader worker={worker} />

        {/* 📍 Map */}
        <LocationMap
          position={position}
          setPosition={setPosition}
          manholes={manholes}
          setManholes={setManholes}
        />

        {/* 🕳️ Navigator */}
        <ManholeNavigator
          position={position}
          manholes={manholes}
        />

        {/* 🧪 Gas */}
        <GasStatus />

        {/* 🚨 Emergency */}
        <SOSButton />

        {/* 📋 Work */}
        <WorkStatus />

        <div style={{ marginTop: "10px", opacity: 0.7 }}>
          Worker Tracking Active
        </div>

      </div>

    </div>
  );
};

export default WorkerDashboard;