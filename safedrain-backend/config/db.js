const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://aditya:aditya123@test.mkvahfo.mongodb.net/?appName=test");

    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};

module.exports = connectDB;
