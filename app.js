var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const csurf = require('csurf');
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mosqueesRouter = require("./routes/mosquees");
var categoriesRouter = require("./routes/categories");
var postsRouter = require("./routes/posts");
var feedbacksRouter = require("./routes/feedbacks");
var responsesRouter = require("./routes/responses");
var notificationsRouter = require("./routes/notifications");

require("./models/connection");

// Ajouter <input type="hidden" name="_csrf" value="${res.locals.csrfToken}"> dans les formulaires

var app = express();

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

const cors = require("cors");

app.use(cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["set-cookie"],
}));

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
app.use("/notifications", notificationsRouter);

console.log("Server started");


module.exports = app;
