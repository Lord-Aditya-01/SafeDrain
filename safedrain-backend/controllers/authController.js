const Worker = require("../models/Worker");

exports.register = async (req,res) => {

  const { name, workerId, password } = req.body;

  const worker = await Worker.create({
    name,
    workerId,
    password
  });

  res.json(worker);
};
