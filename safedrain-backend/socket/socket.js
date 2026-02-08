const Location = require("../models/Location");

module.exports = (io) => {

  const activeWorkers = {}; // live worker memory

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    // Worker joins
    socket.on("join-worker", (workerId) => {
      socket.workerId = workerId;
      activeWorkers[workerId] = {
        workerId,
        socketId: socket.id,
        online: true
      };
      console.log("Worker joined:", workerId);
    });

    // Supervisor joins
    socket.on("join-supervisor", () => {
      socket.join("supervisors");
      console.log("Supervisor connected");
      // 🔥 SEND ALL ACTIVE WORKERS IMMEDIATELY
      socket.emit("initial-workers", Object.values(activeWorkers));
    });

    // Worker sends location
    socket.on("send-location", async (data) => {

  console.log("🔥 BACKEND RECEIVED LOCATION:", data);

  try {

    await Location.create(data);

    console.log("🔥 EMITTING TO SUPERVISORS");

    // TEMP TEST (broadcast to ALL clients)
    io.emit("receive-location", data);

  } catch(err) {

    console.log("Error saving location:", err);

  }

});


    socket.on("disconnect", () => {
      if (socket.workerId) {
        console.log("Worker disconnected:", socket.workerId);
        if (activeWorkers[socket.workerId]) {
          activeWorkers[socket.workerId].online = false;
        }
      }
    });
  });
};
