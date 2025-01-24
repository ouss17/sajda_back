var express = require("express");
const { auth } = require("../middleware/auth");

const {
  retrieveAllNotifs,
  getOneNotification,
  addNotification,
  modifyNotification,
  removeNotification,
} = require("../controllers/notifications");
var router = express.Router();
router.get("/", retrieveAllNotifs);
router.get("/notification/:notificationId", getOneNotification);
router.post("/", auth, addNotification);
router.put("/update/:notificationId", auth, modifyNotification);
router.delete("/delete/:notificationId", auth, removeNotification);
module.exports = router;
