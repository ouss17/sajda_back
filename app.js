var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mosqueesRouter = require("./routes/mosquees");
var categoriesRouter = require("./routes/categories");
var postsRouter = require("./routes/posts");
var feedbacksRouter = require("./routes/feedbacks");
var responsesRouter = require("./routes/responses");

require("./models/connection");
require("./models/connection_mysql");
require("./models/connection_redis");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/mosquees", mosqueesRouter);
app.use("/categories", categoriesRouter);
app.use("/posts", postsRouter);
app.use("/feedbacks", feedbacksRouter);
app.use("/responses", responsesRouter);

module.exports = app;
