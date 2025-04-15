var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usersRoute");
var mosqueesRouter = require("./routes/mosquees");
var categoriesRouter = require("./routes/categoriesRoute");
var postsRouter = require("./routes/posts");
var feedbacksRouter = require("./routes/feedbacks");
var responsesRouter = require("./routes/responses");
var notificationsRouter = require("./routes/notifications");

require("./models/connection");

// Ajouter <input type="hidden" name="_csrf" value="${res.locals.csrfToken}"> dans les formulaires

var app = express();

app.use(cookieParser());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
});
app.use(limiter);

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
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
