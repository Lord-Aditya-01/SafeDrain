const router = require("express").Router();
const { updateLocation } = require("../controllers/locationController");
router.get("/update", (req,res)=>{
   res.send("Location route working");
});

router.post("/update", updateLocation);

module.exports = router;
