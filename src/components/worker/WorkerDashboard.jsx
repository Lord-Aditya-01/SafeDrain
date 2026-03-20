import WorkerHeader from "./WorkerHeader";
import LocationMap from "./LocationMap";
import SOSButton from "./SOSButton";
import WorkStatus from "./WorkStatus";
import "./worker.css";
import { useEffect, useState } from "react";
import socket from "../../socket";

const WorkerDashboard = () => {

  const [worker, setWorker] = useState(null);

  useEffect(() => {

    // ===============================
    // ✅ STEP 1: LOAD FROM LOCAL STORAGE (FAST)
    // ===============================
    const localWorker = localStorage.getItem("worker");

    if (localWorker) {
      setWorker(JSON.parse(localWorker));
    }

    // ===============================
    // ✅ STEP 2: ENSURE SOCKET CONNECTED
    // ===============================
    if (!socket.connected) {
      socket.connect();
    }

    // ===============================
    // ✅ STEP 3: GET LIVE SESSION DATA
    // ===============================
    socket.emit("get-worker-session");

    const handleWorkerUpdate = (data) => {

      if (!data) return;

      setWorker(data);

      // 🔥 update localStorage (important)
      localStorage.setItem("worker", JSON.stringify(data));
    };

    socket.on("worker-session-data", handleWorkerUpdate);

    // ===============================
    // ✅ CLEANUP
    // ===============================
    return () => {
      socket.off("worker-session-data", handleWorkerUpdate);
    };

  }, []);

  // ===============================
  // ⏳ LOADING STATE (IMPROVED UI)
  // ===============================
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

  // ===============================
  // ✅ MAIN UI
  // ===============================
  return (
    <div className="worker-dashboard">

      <div className="worker-container">

        <WorkerHeader worker={worker} />

        {/* 📍 GPS tracking */}
        <LocationMap />

        {/* 🚨 Emergency */}
        <SOSButton />

        {/* 📋 Work status */}
        <WorkStatus />

        <div style={{ marginTop: "10px", opacity: 0.7 }}>
          Worker Tracking Active
        </div>

      </div>

    </div>
  );
};

export default WorkerDashboard;