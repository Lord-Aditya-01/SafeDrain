const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  workerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  password: {
    type: String,
    required: true
  },

  mobile: String,

  emergencyContact: String,

  role: {
    type: String,
    default: "worker"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Worker", WorkerSchema);
