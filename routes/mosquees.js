var express = require("express");
var router = express.Router();
const { createMosquee } = require("../controllers/mosquees");

/* GET users listing. */
router.get("/", function (req, res, next) {});

router.post("/", createMosquee);

module.exports = router;
