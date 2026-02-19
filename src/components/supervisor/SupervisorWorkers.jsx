import { useEffect, useState } from "react";
import socket from "../../socket";

const SupervisorWorkers = () => {

  const [workers, setWorkers] = useState([]);

  useEffect(() => {

    socket.emit("join-supervisor");

    // Initial list
    socket.on("initial-workers", (data) => {
      setWorkers(data);
    });

    // Live updates
    socket.on("receive-location", (worker) => {
      setWorkers(prev => {

        const updated = [...prev];
        const index = updated.findIndex(w => w.id === worker.id);

        if(index !== -1){
          updated[index] = worker;
        } else {
          updated.push(worker);
        }

        return updated;
      });
    });

    // Remove offline workers
    socket.on("worker-offline", ({ workerId }) => {

      setWorkers(prev =>
        prev.filter(w => w.id !== workerId)
      );

    });

    return () => {
      socket.off("initial-workers");
      socket.off("receive-location");
      socket.off("worker-offline");
    };

  }, []);

  return (
    <div>

      <h2>Active Workers</h2>

      {workers.map(worker => (

        <div key={worker.id} style={{marginBottom:"10px"}}>

          <strong>{worker.name}</strong>

          <p>ID: {worker.id}</p>
          <p>Status: {worker.status}</p>
          <p>Work Status: {worker.workStatus}</p>
          <p>Oxygen: {worker.oxygen || "--"}</p>
          <p>Toxic: {worker.toxic || "--"}</p>

        </div>

      ))}

    </div>
  );
};

export default SupervisorWorkers;
