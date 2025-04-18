var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addMosquee,
  retrieveMosquee,
  retrieveAllAvailableMosquee,
  retrieveCsv,
  modifyMosquee,
  removeMosquee,
} = require("../controllers/mosqueesController");

router.post("/", auth, addMosquee);
router.get("/:mosqueeId", retrieveMosquee);
router.get("/", retrieveAllAvailableMosquee);
router.get("/csv/:mosqueeId/:year", retrieveCsv);
router.put("/update/:mosqueeId", auth, modifyMosquee);
router.delete("/delete/:mosqueeId", auth, removeMosquee);

module.exports = router;
