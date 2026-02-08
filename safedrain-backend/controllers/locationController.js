const Location = require("../models/Location");

exports.updateLocation = async (req, res) => {
  try {
    const { workerId, latitude, longitude } = req.body;

    if (!workerId || latitude == null || longitude == null) {
      return res.status(400).json({ message: "Invalid location data" });
    }

    const location = await Location.create({
      workerId,
      latitude,
      longitude
    });

    res.status(200).json({
      message: "Location saved",
      location
    });
  } catch (error) {
    console.error("Location error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
