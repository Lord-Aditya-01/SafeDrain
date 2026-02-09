const router = require("express").Router();

const { updateLocation } = require("../controllers/locationController");

// health check
router.get("/health", (req, res) => {
   res.send("Location route working");
});

// REST location update (optional fallback)
router.post("/update", updateLocation);

module.exports = router;
