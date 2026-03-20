const Location = require("../models/Location");
const Worker = require("../models/Worker");
const { spawn } = require("child_process");
const workersState = {}; // ⭐ MASTER LIVE WORKER STATE
function runAI(workerData) {
  return new Promise((resolve) => {

    const py = spawn("python", ["../ai-engine/run_pipeline.py"]);

    let result = "";

    // send data to python
    py.stdin.write(JSON.stringify(workerData));
    py.stdin.end();

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.on("close", () => {
      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (e) {
        console.log("AI ERROR:", e);
        resolve(null);
      }
    });

  });
}
module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // auto join supervisor
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
      socket.emit("supervisor-auth-result", socket.role === "supervisor");
    });

    // ===============================
    // ✅ WORKER SIGNUP (FIXED)
    // ===============================

    socket.on("worker-signup", async (data) => {

      console.log("Signup called:", data); // 🔍 DEBUG

      try {

        const { name, workerId, password, mobile, emergencyContact } = data;

        // ✅ validation
        if (!name || !workerId || !password) {
          socket.emit("worker-signup-failed", "Missing required fields");
          return;
        }

        // ✅ check duplicate
        const exists = await Worker.findOne({ workerId });

        if (exists) {
          socket.emit("worker-signup-failed", "Worker already exists");
          return;
        }

        // ✅ save to DB
        const worker = await Worker.create({
          name,
          workerId,
          password,
          mobile,
          emergencyContact
        });

        console.log("Worker saved:", worker.workerId);

        socket.emit("worker-signup-success", worker);

      } catch (err) {
        console.log("Signup error:", err);
        socket.emit("worker-signup-failed", "Signup error");
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
          mobile: worker.mobile,
          emergencyContact: worker.emergencyContact,
          status: "NORMAL",
          online: true
        };

        socket.emit("worker-login-success", {
          workerId: worker.workerId,
          name: worker.name,
          emergencyContact: worker.emergencyContact
        });

        console.log("Worker logged in:", workerId);

      } catch (err) {
        console.log("Worker login error:", err);
      }

    });

    // ===============================
    // ✅ GET WORKER SESSION
    // ===============================

    socket.on("get-worker-session", () => {
      if (socket.role !== "worker") return;
      socket.emit("worker-session-data", workersState[socket.workerId]);
    });

    // ===============================
    // ✅ SUPERVISOR JOIN
    // ===============================

    socket.on("join-supervisor", () => {
      socket.join("supervisors");

      socket.emit("initial-workers", Object.values(workersState));
    });

    // ===============================
    // ✅ WORKER LOCATION UPDATE
    // ===============================

    socket.on("worker-location-update", async (data) => {

      const id = socket.workerId;
      if (!id) return;

      if (!data?.latitude || !data?.longitude) {
        console.log("Invalid location data");
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

      io.to("supervisors").emit("receive-location", workersState[id]);

    });

    // ===============================
    // ✅ GAS UPDATE
    // ===============================

    socket.on("worker-gas-update", async (data) => {

      const id = socket.workerId;
      if (!id) return;

      // STEP 1: update worker data
      workersState[id] = {
        ...workersState[id],
        ...data
      };

      // STEP 2: RUN AI
      const aiResult = await runAI(workersState[id]);

      // STEP 3: attach AI results
      if (aiResult) {
        workersState[id] = {
          ...workersState[id],

          final_status: aiResult.final_status,
          risk_score: aiResult.risk_score,
          entry_decision: aiResult.entry_decision,
          safe_work_time_minutes: aiResult.safe_work_time_minutes,
          risk_reason: aiResult.risk_reason,
          decision_reason: aiResult.decision_reason
        };
      }

      // STEP 4: send to frontend
      io.to("supervisors").emit("receive-location", workersState[id]);

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

      io.to("supervisors").emit("receive-location", workersState[id]);

    });

    // ======================7=========
    // ✅ SOS EMERGENCY
    // ===============================

    socket.on("worker-sos", () => {

      const id = socket.workerId;
      if (!id) return;

      workersState[id].status = "EMERGENCY";

      io.to("supervisors").emit("receive-location", workersState[id]);

      io.to("supervisors").emit("new-alert", {
        type: "SOS",
        workerId: id,
        name: workersState[id].name,
        message: "SOS Emergency Activated",
        time: Date.now()
      });

    });

    // ===============================
    // ✅ WORKER LOGOUT
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
    // ✅ DISCONNECT
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
    // ✅ CHECK WORKER AUTH
    // ===============================

    socket.on("check-worker-auth", () => {

      socket.emit("worker-auth-result", socket.role === "worker");

    });

  });

};