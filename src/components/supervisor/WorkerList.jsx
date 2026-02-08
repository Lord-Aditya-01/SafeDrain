const WorkerList = ({ workers, onSelect }) => {

  return (
    <div>

      <h3 style={{ marginBottom: "8px" }}>Live Workers</h3>

      {workers.length === 0 && (
        <p style={{ fontSize: "13px", opacity: 0.7 }}>
          No workers online
        </p>
      )}

      {workers.map((worker) => (

        <div
          key={worker.workerId}
          onClick={() => onSelect(worker)}
          style={{
            padding: "10px",
            marginBottom: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#020617",
            border: "1px solid #1e293b"
          }}
        >

          <strong>{worker.workerId}</strong>

          <br />

          <span style={{ fontSize: "12px" }}>
            ID: {worker.workerId}
          </span>

          <br />

          <span style={{
            fontSize: "12px",
            color: "#86efac"
          }}>
            ONLINE
          </span>

        </div>

      ))}

    </div>
  );
};

export default WorkerList;
