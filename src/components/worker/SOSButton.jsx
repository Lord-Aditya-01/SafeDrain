import socket from "../../socket";

const SOSButton = () => {

  const handleSOS = () => {

  // 🚨 Notify backend + supervisor
  socket.emit("worker-sos");

  // 📞 Open emergency contact dialer
  const worker = JSON.parse(localStorage.getItem("worker"));

  const emergencyNumber = worker?.emergencyContact;

  if (emergencyNumber) {
    window.location.href = `tel:${emergencyNumber}`;
  } else {
    console.log("No emergency contact found");
  }

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
