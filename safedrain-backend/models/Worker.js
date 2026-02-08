const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  name: String,
  workerId: String,
  password: String,
  role: { type: String, default: "worker" }
});

module.exports = mongoose.model("Worker", WorkerSchema);
