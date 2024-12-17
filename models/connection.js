const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING_MONGO;

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("✅ Mongo Database connected"))
  .catch((err) => console.error(err));
