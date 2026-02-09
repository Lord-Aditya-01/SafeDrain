import { useEffect, useState } from "react";
import WorkersMap from "./WorkersMap";
import WorkerList from "./WorkerList";
import SupervisorNavbar from "./SupervisorNavbar";
import SupervisorFooter from "./SupervisorFooter";
import "./supervisor.css";
import socket from "../../socket";

const SupervisorDashboard = () => {

  const [workers, setWorkers] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {

    // Join supervisor room once
    socket.emit("join-supervisor");

    // Initial workers list from server
    const handleInitialWorkers = (data) => {

      if (!Array.isArray(data)) return;

      console.log("Initial workers:", data);

      const formatted = {};

      data.forEach(worker => {
        if (worker?.id) {
          formatted[worker.id] = worker;
        }
      });

      setWorkers(formatted);
    };

    // Live location updates
    const handleLocation = (data) => {

      if (!data?.id) return;

      console.log("Worker location:", data);

      setWorkers(prev => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          ...data
        }
      }));
    };

    socket.on("initial-workers", handleInitialWorkers);
    socket.on("receive-location", handleLocation);

    return () => {
      socket.off("initial-workers", handleInitialWorkers);
      socket.off("receive-location", handleLocation);
    };

  }, []);

  return (
    <div className="supervisor-dashboard">
      <SupervisorNavbar />

      <div className="supervisor-content">
        <div className="supervisor-map">
          <WorkersMap
            workers={Object.values(workers)}
            selectedWorker={selectedWorker}
          />
        </div>

        <div className="supervisor-panel">
          <WorkerList
            workers={Object.values(workers)}
            onSelect={setSelectedWorker}
          />
        </div>
      </div>

      <SupervisorFooter />

      <div>Live Tracking</div>

    </div>
  );
};

export default SupervisorDashboard;
