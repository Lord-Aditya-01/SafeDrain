const Worker = require("../models/Worker");

exports.register = async (req, res) => {

  try {

    const {
      name,
      workerId,
      password,
      mobile,
      emergencyContact
    } = req.body;

    // check duplicate worker
    const exists = await Worker.findOne({ workerId });

    if (exists) {
      return res.status(400).json({
        message: "Worker ID already exists"
      });
    }

    const worker = await Worker.create({
      name,
      workerId,
      password, // later use bcrypt hashing
      mobile,
      emergencyContact
    });

    res.json(worker);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Registration failed"
    });

  }

};
