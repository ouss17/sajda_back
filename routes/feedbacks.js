var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addFeedback,
  retrieveOneFeedback,
  retrieveFeedbacksByMosquee,
  retrieveFeedbacksByUser,
  modifyFeedback,
  removeFeedback,
} = require("../controllers/feedbacks");

router.post("/", auth, addFeedback);
router.get("/feedback/:feedbackId", auth, retrieveOneFeedback);
router.get("/mosquee/:mosqueeId", auth, retrieveFeedbacksByMosquee);
router.get("/user/:userId", auth, retrieveFeedbacksByUser);
router.put("/update/:feedbackId", auth, modifyFeedback);
router.delete("/delete/:feedbackId", auth, removeFeedback);

module.exports = router;