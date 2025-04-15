var express = require("express");
const { auth } = require("../middleware/auth");
const {
  addCategory,
  retrieveCategories,
  modifyCategory,
  removeCategory,
} = require("../controllers/categoriesController");
var router = express.Router();

/* GET categories listing. */
router.post("/", auth, addCategory);
router.get("/", retrieveCategories);
router.put("/update/:urlCategory", auth, modifyCategory);
router.delete("/delete/:urlCategory", auth, removeCategory);
module.exports = router;
