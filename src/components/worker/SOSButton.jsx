import socket from "../../socket";

const SOSButton = () => {

  const handleSOS = () => {

    // 🚨 Notify backend immediately
    socket.emit("worker-sos", {
      status: "EMERGENCY",
      updatedAt: Date.now()
    });

    // Alert worker
    alert("🚨 SOS Activated! Supervisor has been notified.");

  };

  return (
    <div className="mb-4">
      <button className="sos-btn" onClick={handleSOS}>
        🚨 SOS EMERGENCY
      </button>
    </div>
  );
};

export default SOSButton;
