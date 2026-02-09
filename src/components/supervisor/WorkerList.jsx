const WorkerList = ({ workers = [], onSelect, selectedWorker }) => {

  const getStatusColor = (status) => {
    if (status === "EMERGENCY") return "#ef4444";
    if (status === "WARNING") return "#f59e0b";
    return "#86efac";
  };

  return (
    <div>

      <h3 style={{ marginBottom: "8px" }}>
        Live Workers
      </h3>

      {workers.length === 0 && (
        <p style={{ fontSize: "13px", opacity: 0.7 }}>
          No workers online
        </p>
      )}

      {workers.map((worker) => (

        <div
          key={worker.id}
          onClick={() => onSelect(worker)}
          style={{
            padding: "10px",
            marginBottom: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            background:
              selectedWorker?.id === worker.id
                ? "#0f172a"
                : "#020617",
            border: "1px solid #1e293b"
          }}
        >

          <strong>{worker.name || worker.id}</strong>

          <br />

          <span style={{ fontSize: "12px" }}>
            ID: {worker.id}
          </span>

          <br />

          <span
            style={{
              fontSize: "12px",
              color: getStatusColor(worker.status),
              fontWeight: "bold"
            }}
          >
            {worker.status || "NORMAL"}
          </span>

        </div>

      ))}

    </div>
  );
};

export default WorkerList;
