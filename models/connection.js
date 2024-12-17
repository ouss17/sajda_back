const mongoose = require("mongoose");
var mysql = require('mysql');
require('dotenv').config();

const connectionString = process.env.CONNECTION_STRING_MONGO;


mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("✅ Mongo Database connected"))
  .catch((err) => console.error(err));



var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

con.connect(function (err) {
  if (err) throw err;
  console.log("✅ Mysql Database connected");
});