const Location = require("../models/Location");
const Worker = require("../models/Worker");

const workersState = {}; // ⭐ MASTER LIVE WORKER STATE

module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    if (socket.handshake.query.role === "supervisor") {
    socket.join("supervisors");
    console.log("Supervisor auto-joined room");
  }
    // ===============================
    // ✅ SUPERVISOR LOGIN
    // ===============================

    socket.on("supervisor-login", ({ username, password }) => {

      if (username === "supervisor" && password === "admin123") {
        socket.role = "supervisor";
        socket.join("supervisors");
        socket.emit("supervisor-login-success");
      } else {
        socket.emit("supervisor-login-failed");
      }
    });

    socket.on("check-supervisor-auth", () => {
      if (socket.role === "supervisor") {
        socket.emit("supervisor-auth-result", true);
      } else {
        socket.emit("supervisor-auth-result", false);
      }
    });

    // ===============================
    // ✅ WORKER LOGIN
    // ===============================

    socket.on("worker-login", async ({ workerId, password }) => {
      try {
        const worker = await Worker.findOne({ workerId });
        if (!worker || worker.password !== password) {
          socket.emit("worker-login-failed");
          return;
        }
        socket.role = "worker";
        socket.workerId = workerId;
        workersState[workerId] = {
          id: workerId,
          workerId,
          name: worker.name,
          status: "NORMAL",
          online: true
        };
        socket.emit("worker-login-success", {
        workerId: worker.workerId,
        name: worker.name,
        emergencyContact: worker.emergencyContact
        });
        console.log("Worker logged in:", workerId);
      } catch(err) {
        console.log("Worker login error:", err);
      }
    });

    // ===============================
    // ✅ SEND WORKER SESSION DATA
    // ===============================

    socket.on("get-worker-session", () => {
      if (socket.role !== "worker") return;
      socket.emit(
        "worker-session-data",
        workersState[socket.workerId]
      );
    });

    // ===============================
    // ✅ SUPERVISOR JOIN
    // ===============================

    socket.on("join-supervisor", () => {
      socket.join("supervisors");
      // ⭐ SEND CURRENT ACTIVE WORKERS
      socket.emit(
        "initial-workers",
        Object.values(workersState)
      );
    });

    // ===============================
    // ✅ WORKER LOCATION UPDATE
    // ===============================

    socket.on("worker-location-update", async (data) => {

    const id = socket.workerId;
    if (!id) return;

    // Ignore invalid data
    if (!data?.latitude || !data?.longitude) {
      console.log("Skipped invalid location update");
      return;
    }

    workersState[id] = {
      ...workersState[id],
      lat: data.latitude,
      lng: data.longitude,
      updatedAt: Date.now()
    };

    await Location.create({
      workerId: id,
      latitude: data.latitude,
      longitude: data.longitude
    });

    io.to("supervisors").emit(
      "receive-location",
      workersState[id]
    );
  });


    // ===============================
    // ✅ GAS UPDATE
    // ===============================

    socket.on("worker-gas-update", (data) => {

      const id = socket.workerId;
      if (!id) return;

      workersState[id] = {
        ...workersState[id],
        ...data
      };

      io.to("supervisors").emit(
        "receive-location",
        workersState[id]
      );

    });

    // ===============================
    // ✅ WORK STATUS UPDATE
    // ===============================

    socket.on("worker-work-status", (data) => {
      const id = socket.workerId;
      if (!id) return;
      workersState[id] = {
        ...workersState[id],
        ...data
      };
      io.to("supervisors").emit(
        "receive-location",
        workersState[id]
      );
    });

    // ===============================
    // ✅ SOS EMERGENCY
    // ===============================

    socket.on("worker-sos", () => {
      const id = socket.workerId;
      if (!id) return;
      workersState[id].status = "EMERGENCY";
      io.to("supervisors").emit(
        "receive-location",
        workersState[id]
      );
    });

    // ===============================
    // ✅ WORKER LOGOUT (FIXED)
    // ===============================

    socket.on("worker-logout", () => {
      if (socket.workerId) {
        delete workersState[socket.workerId];
        io.to("supervisors").emit("worker-offline", {
          workerId: socket.workerId
        });
        console.log("Worker logged out:", socket.workerId);
      }
    });

    // ===============================
    // ✅ DISCONNECT (FIXED - SINGLE HANDLER)
    // ===============================

    socket.on("disconnect", () => {
  if (socket.workerId && workersState[socket.workerId]) {
    delete workersState[socket.workerId];
    io.to("supervisors").emit("worker-offline", {
      workerId: socket.workerId
    });
    console.log("Worker disconnected:", socket.workerId);
  }
});


    // ===============================
    // ✅ WORKER SIGNUP
    // ===============================

    socket.on("worker-signup", async (data) => {

      try {

        const exists = await Worker.findOne({
          workerId: data.workerId
        });

        if (exists) {
          socket.emit("worker-signup-failed", "Worker already exists");
          return;
        }

        await Worker.create(data);
        socket.emit("worker-signup-success");

      } catch (err) {
        socket.emit("worker-signup-failed", "Signup error");
      }

    });

    // ===============================
    // ✅ CHECK WORKER AUTH
    // ===============================

    socket.on("check-worker-auth", () => {

      if (socket.role === "worker") {
        socket.emit("worker-auth-result", true);
      } else {
        socket.emit("worker-auth-result", false);
      }

    });

  });
};
