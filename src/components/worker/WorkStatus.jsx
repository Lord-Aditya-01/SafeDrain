import { useEffect, useState } from "react";

const MANHOLE_THRESHOLD = 20 * 60 * 1000; // 20 minutes
const WARNING_THRESHOLD = 15 * 60 * 1000;

const WorkStatus = () => {
  const [status, setStatus] = useState(
    localStorage.getItem("workStatus") || "Outside"
  );

  const [startTime, setStartTime] = useState(
    localStorage.getItem("manholeStartTime")
  );

  // Handle status change
  useEffect(() => {
    localStorage.setItem("workStatus", status);

    
    if (status === "In Manhole") {
      const now = new Date().getTime();
      localStorage.setItem("manholeStartTime", now.toString());
      setStartTime(now);
    }
    if (status === "Completed" || status === "Outside") {
      localStorage.removeItem("manholeStartTime");
      setStartTime(null);
    }
  }, [status]);

  // Overtime monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (!startTime) return;

      const elapsed =
        new Date().getTime() - Number(startTime);

      if (elapsed > WARNING_THRESHOLD && elapsed <= MANHOLE_THRESHOLD) {
      localStorage.setItem("workerStatus", "WARNING");
      localStorage.setItem(
        "emergencyReason",
        "Worker inside manhole longer than expected"
      );
      }

    if (elapsed > MANHOLE_THRESHOLD) {
      localStorage.setItem("workerStatus", "EMERGENCY");
      localStorage.setItem(
        "emergencyReason",
        "Worker exceeded safe manhole duration"
      );
    }
    }, 5000);

    return () => clearInterval(interval);
  }, [startTime]);

const secondsInside = startTime
  ? Math.floor((new Date().getTime() - Number(startTime)) / 1000)
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
