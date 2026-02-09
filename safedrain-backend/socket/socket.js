const Location = require("../models/Location");
const Worker = require("../models/Worker");

const workersState = {}; // ⭐ MASTER LIVE WORKER STATE

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    // ==============================
    // ✅ SUPERVISOR LOGIN
    // ==============================

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

    console.log("Supervisor auth check requested");

    if (socket.role === "supervisor") {

        console.log("Supervisor authenticated");

        socket.emit("supervisor-auth-result", true);

    } else {

        console.log("Supervisor NOT authenticated");

        socket.emit("supervisor-auth-result", false);

    }

  });

    // ==============================
    // ✅ WORKER LOGIN
    // ==============================

    socket.on("worker-login", async ({ workerId, password }) => {

      try {

        const worker = await Worker.findOne({ workerId });

        if (!worker || worker.password !== password) {
          socket.emit("worker-login-failed");
          return;
        }

        socket.role = "worker";
        socket.workerId = workerId;

        // create worker live state
        if (!workersState[workerId]) {
          workersState[workerId] = {
            id: workerId,
            name: worker.name,
            status: "NORMAL",
            online: true
          };
        }

        socket.emit("worker-login-success");

        console.log("Worker logged in:", workerId);

      } catch(err) {
        console.log("Worker login error:", err);
      }

    });

    // ==============================
    // ✅ SEND WORKER SESSION DATA
    // ==============================

    socket.on("get-worker-session", () => {

      if (socket.role !== "worker") return;

      socket.emit(
        "worker-session-data",
        workersState[socket.workerId]
      );

    });

    // ==============================
    // ✅ SUPERVISOR JOIN
    // ==============================

    socket.on("join-supervisor", () => {

      socket.join("supervisors");

      socket.emit(
        "initial-workers",
        Object.values(workersState)
      );

    });

    // ==============================
    // ✅ WORKER LOCATION UPDATE
    // ==============================

    socket.on("worker-location-update", async (data) => {

      const id = socket.workerId;
      if (!id) return;

      try {

        workersState[id] = {
          ...workersState[id],
          ...data
        };

        // optional DB save
        await Location.create({
          workerId: id,
          ...data
        });

        io.to("supervisors").emit(
          "receive-location",
          workersState[id]
        );

      } catch(err) {
        console.log("Location save error:", err);
      }

    });

    // ==============================
    // ✅ GAS UPDATE
    // ==============================

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

    // ==============================
    // ✅ WORK STATUS UPDATE
    // ==============================

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

    // ==============================
    // ✅ SOS EMERGENCY
    // ==============================

    socket.on("worker-sos", () => {

      const id = socket.workerId;
      if (!id) return;

      workersState[id].status = "EMERGENCY";

      io.to("supervisors").emit(
        "receive-location",
        workersState[id]
      );

    });

    // ==============================
    // ✅ DISCONNECT
    // ==============================

    socket.on("disconnect", () => {

      if (socket.workerId && workersState[socket.workerId]) {

        workersState[socket.workerId].online = false;

        io.to("supervisors").emit(
          "receive-location",
          workersState[socket.workerId]
        );

        console.log("Worker disconnected:", socket.workerId);
      }

    });
    // Worker signup
    socket.on("worker-signup", async (data) => {

    console.log("🔥 Signup received:", data);

    try {

      const exists = await Worker.findOne({
        workerId: data.workerId
      });

      if (exists) {
        socket.emit("worker-signup-failed", "Worker already exists");
        return;
      }

      await Worker.create(data);

      console.log("✅ Worker registered:", data.workerId);

      socket.emit("worker-signup-success");

    } catch (err) {

      console.log("Signup error:", err);

      socket.emit("worker-signup-failed", "Signup error");

    }

    });
    socket.on("check-worker-auth", () => {

    console.log("Auth check requested");

    if (socket.role === "worker") {
        socket.emit("worker-auth-result", true);
    } else {
        socket.emit("worker-auth-result", false);
    }

    });

  });
};
