const Worker = require("../models/Worker");

// Get worker profile
exports.getWorker = async (req, res) => {

  try {

    const { workerId } = req.params;

    const worker = await Worker.findOne({ workerId });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found"
      });
    }

    res.json(worker);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};
