var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addResponse,
  retrieveOneResponse,
  retrieveResponsesByUser,
  modifyResponse,
  removeResponse,
} = require("../controllers/responsesController");

router.post("/", auth, addResponse);
router.get("/response/:responseId", auth, retrieveOneResponse);
router.get("/user/:userId", auth, retrieveResponsesByUser);
router.put("/update/:responseId", auth, modifyResponse);
router.delete("/delete/:responseId", auth, removeResponse);

module.exports = router;
