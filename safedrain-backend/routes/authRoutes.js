const express = require("express");
const router = express.Router();

// health check
router.get("/", (req, res) => {
    res.send("Auth route working");
});

// future example
// router.post("/login", controller.login);
// router.post("/signup", controller.signup);

module.exports = router;
