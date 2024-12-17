var mysql = require("mysql");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "sajda",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("✅ Mysql Database connected");
});

module.exports = con;
