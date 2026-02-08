const SOSButton = () => {
  const handleSOS = () => {
    const worker = JSON.parse(localStorage.getItem("workerData"));

    if (!worker || !worker.emergencyContact) {
      alert("Emergency contact not found");
      return;
    }

    // Update worker status (optional for later use)
    localStorage.setItem("workerStatus", "EMERGENCY");

    // Alert user
    alert(
      `🚨 SOS Activated!\nCalling Emergency Contact: ${worker.emergencyContact}`
    );

    // 📞 Open phone dialer (works on mobile)
    window.location.href = `tel:${worker.emergencyContact}`;
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
