var express = require("express");
var router = express.Router();
const con = require("../models/connection_mysql");

/* GET users listing. */
router.get("/", function (req, res, next) {});

router.post("/", function (req, res, next) {
  try {
    // Query to insert multiple rows
    let query =
      "INSERT INTO mosquees (name, address, city, zip, country) VALUES (?);";

    // Values to be inserted
    let values = [
      req.body.name,
      req.body.address,
      req.body.city,
      req.body.zip,
      req.body.country,
    ];

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) throw err;
      console.log("All Rows Inserted");
      res.json({ result: true, data: "Row inserted" });
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
