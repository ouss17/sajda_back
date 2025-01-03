var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addMosquee,
  retrieveMosquee,
  retrieveAllAvailableMosquee,
  modifyMosquee,
  removeMosquee,
} = require("../controllers/mosquees");

router.post("/", auth, addMosquee);
router.get("/:mosqueeId", retrieveMosquee);
router.get("/", retrieveAllAvailableMosquee);
router.put("/update/:mosqueeId", auth, modifyMosquee);
router.delete("/delete/:mosqueeId", auth, removeMosquee);

module.exports = router;
