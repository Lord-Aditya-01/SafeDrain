const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {

  const py = spawn("python", ["ai-engine/run_pipeline.py", req.file.path]);

  let result = "";

  py.stdout.on("data", (data) => {
    result += data.toString();
  });

  py.on("close", () => {
    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch {
      res.status(500).json({ error: "AI processing failed" });
    }
  });

});

module.exports = router;