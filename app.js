var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usersRoute");
var mosqueesRouter = require("./routes/mosqueesRoute");
var categoriesRouter = require("./routes/categoriesRoute");
var postsRouter = require("./routes/postsRoute");
var feedbacksRouter = require("./routes/feedbacksRoute");
var responsesRouter = require("./routes/responsesRoute");
var notificationsRouter = require("./routes/notifications");

require("./models/connection");

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sajda API Documentation",
      version: "1.0.0",
      description: "Documentation générée automatiquement avec swagger-jsdoc",
    },
     components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const uiOptions = {
  swaggerOptions: {
    requestInterceptor: (req) => {
      req.headers['X-CSRF-Token'] = '8RKx6BoZ-IrnAHbXUWrfTv_wnCpuoiL5_tMs';
      return req;
    }
  }
};

const swaggerSpec = swaggerJsdoc(options);
var app = express();
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions));

// CSRF protection APPLIQUÉE APRÈS
const csrfProtection = csurf({ cookie: true });



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


// Désactive CSRF pour toutes les routes API en DEV
if (process.env.NODE_ENV === 'development') {
  app.use('/users', usersRouter);
  app.use('/mosquees', mosqueesRouter);
  app.use('/categories', categoriesRouter);
  app.use('/posts', postsRouter);
  app.use('/feedbacks', feedbacksRouter);
  app.use('/responses', responsesRouter);
  app.use('/notifications', notificationsRouter);
} else {
  // En production, protège avec CSRF
  app.use(csrfProtection);
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
  app.use("/users", usersRouter);
  app.use("/mosquees", mosqueesRouter);
  app.use("/categories", categoriesRouter);
  app.use("/posts", postsRouter);
  app.use("/feedbacks", feedbacksRouter);
  app.use("/responses", responsesRouter);
  app.use("/notifications", notificationsRouter);
}

console.log("Server started");


module.exports = app;
