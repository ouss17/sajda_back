const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
