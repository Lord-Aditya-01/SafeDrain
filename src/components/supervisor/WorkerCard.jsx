const WorkerCard = ({ title, children }) => {

  return (
    <div className="worker-card">

      {title && (
        <h3 className="worker-card-title">
          {title}
        </h3>
      )}

      {children}

    </div>
  );
};

export default WorkerCard;
