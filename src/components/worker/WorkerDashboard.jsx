import WorkerHeader from "./WorkerHeader";
import LocationMap from "./LocationMap";
import GasStatus from "./GasStatus";
import SOSButton from "./SOSButton";
import WorkStatus from "./WorkStatus";
import "./worker.css";
import { useEffect, useState } from "react";
import socket from "../../socket";

const WorkerDashboard = () => {

  const [worker, setWorker] = useState(null);

  useEffect(() => {

    // Ask backend for worker session data
    socket.emit("get-worker-session");

    socket.once("worker-session-data", (data) => {
      setWorker(data);
    });

  }, []);

  if (!worker) {
    return <div>Loading worker data...</div>;
  }

  return (
    <div className="worker-dashboard">

      <div className="worker-container">

        <WorkerHeader worker={worker} />

        {/* GPS tracking handled inside LocationMap */}
        <LocationMap />

        {worker.workStatus === "Inside" ? (
          <GasStatus />
        ) : (
          <div className="worker-card">
            Gas monitoring inactive (Worker outside manhole)
          </div>
        )}

        <SOSButton />

        <WorkStatus />

        <div>Worker Tracking Active</div>

      </div>

    </div>
  );
};
export default WorkerDashboard;
