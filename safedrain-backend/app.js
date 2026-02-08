const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

console.log("authRoutes:", authRoutes);

app.use(cors());
app.use(express.json());

console.log("locationRoutes:", locationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.get("/", (req,res)=>{
   res.send("SafeDrain backend running");
});

module.exports = app;
console.log(locationRoutes);
