var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addPost,
  retrievePostsByMosquee,
  retrievePostsAvailable,
  retrieveOnePost,
  retrievePostsByCategory,
  modifyPost,
  removePost,
} = require("../controllers/posts");

router.post("/", auth, addPost);
router.get("/mosquee/:mosqueeId", retrievePostsByMosquee);
router.get("/available", retrievePostsAvailable);
router.get("/post/:postId", retrieveOnePost);
router.get("/category/:mosqueeId/:categoryId", retrievePostsByCategory);
router.put("/update/:postId", auth, modifyPost);
router.delete("/delete/:postId", auth, removePost);

module.exports = router;
