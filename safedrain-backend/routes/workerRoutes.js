const router = require("express").Router();
const workerController = require("../controllers/workerController");

// health check
router.get("/health", (req, res) => {
   res.send("Worker route working");
});

// future example:
// router.get("/:workerId", workerController.getWorker);

module.exports = router;
