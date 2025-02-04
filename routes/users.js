var express = require("express");
const { auth } = require("../middleware/auth");
const {
  signin,
  signup,
  removeUser,
  modifyUser,
  logout,
  modifyPassword,
  modifyRole,
  getMe,
  getUsers
} = require("../controllers/users");
var router = express.Router();

/* GET users listing. */
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getMe", auth, getMe);
router.get("/", auth, getUsers);
router.put("/update/:userId", auth, modifyUser);
router.put("/updatePassword/:userId", auth, modifyPassword);
router.put("/updateRole/:userId", auth, modifyRole);
router.delete("/delete/:userId", auth, removeUser);
router.get("/logout", auth, logout);
module.exports = router;
