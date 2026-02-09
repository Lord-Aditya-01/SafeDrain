const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({

  workerId: {
    type: String,
    required: true,
    index: true
  },

  latitude: {
    type: Number,
    required: true
  },

  longitude: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "NORMAL"
  },

  oxygen: Number,
  toxic: Number,

  workStatus: String,

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Location", LocationSchema);
