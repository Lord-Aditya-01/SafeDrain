import { useEffect, useState } from "react";
import socket from "../../socket";

const MANHOLE_THRESHOLD = 20 * 60 * 1000; // 20 minutes
const WARNING_THRESHOLD = 15 * 60 * 1000;

const WorkStatus = () => {

  const [status, setStatus] = useState("Outside");
  const [startTime, setStartTime] = useState(null);

  // Handle status change
  useEffect(() => {

    if (status === "In Manhole") {
      const now = Date.now();
      setStartTime(now);

      socket.emit("worker-work-status", {
        workStatus: status,
        startTime: now
      });
    }

    if (status === "Completed" || status === "Outside") {
      setStartTime(null);

      socket.emit("worker-work-status", {
        workStatus: status,
        startTime: null
      });
    }

  }, [status]);

  // Overtime monitoring
  useEffect(() => {

    const interval = setInterval(() => {

      if (!startTime) return;

      const elapsed = Date.now() - startTime;

      if (elapsed > WARNING_THRESHOLD && elapsed <= MANHOLE_THRESHOLD) {

        socket.emit("worker-status-update", {
          status: "WARNING",
          reason: "Worker inside manhole longer than expected",
          updatedAt: Date.now()
        });

      }

      if (elapsed > MANHOLE_THRESHOLD) {

        socket.emit("worker-status-update", {
          status: "EMERGENCY",
          reason: "Worker exceeded safe manhole duration",
          updatedAt: Date.now()
        });

      }

    }, 5000);

    return () => clearInterval(interval);

  }, [startTime]);

  const secondsInside = startTime
    ? Math.floor((Date.now() - startTime) / 1000)
    : 0;

  const minutesInside = Math.floor(secondsInside / 60);

  return (
    <div className="worker-card">

      <h3>Work Status</h3>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="work-select"
      >
        <option>Outside</option>
        <option>In Manhole</option>
        <option>Completed</option>
      </select>

      {status === "In Manhole" && startTime && (
        <p style={{ marginTop: "8px", color: "orange", fontWeight: "600" }}>
          ⏱️ Time inside:{" "}
          {minutesInside > 0
            ? `${minutesInside} min`
            : `${secondsInside} sec`}
        </p>
      )}

    </div>
  );
};

export default WorkStatus;
