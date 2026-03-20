const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");


const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

// middleware
app.use("/api/ai", aiRoutes);
app.use(cors());
app.use(express.json()); // ✅ IMPORTANT

// routes
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

// health check
app.get("/", (req, res) => {
  res.send("SafeDrain backend running");
});

module.exports = app;