// Required modules
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Import routers and middlewares
const indexRouter = require("./routes/index");
const authRouter = require("./routes/authRouter.js");
const userRouter = require("./routes/userRouter.js");
const mongoConnect = require("./config/mongoConnect.js");
const loggedInMiddleware = require('./middlewares/isLoggedIn.js');

// Load environment variables
require("dotenv").config();

//load scret keys
const configData = require("./src/config/config.js");
// Connect to MongoDB
mongoConnect(mongoose);

// Initialize Express app
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", loggedInMiddleware, userRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Start server
app.listen(configData.PORT, () => console.log("Server started on port 80"));

module.exports = app;