var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
<<<<<<< HEAD
const productsRouter = require("./routes/products");
const signUpRouter = require('./routes/sign-up');

=======
const signUpRouter = require('./routes/sign-up');

require("dotenv").config();
>>>>>>> 2555270683dc9160809e8869630fbbe7b1f3e464

require("dotenv").config();
var app = express();

// Connection to the Data Base
require("./mysqlDB").connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
<<<<<<< HEAD
app.use("/products", productsRouter);
app.use("/sign-up", signUpRouter)
=======
app.use('/sign-up', signUpRouter);
>>>>>>> 2555270683dc9160809e8869630fbbe7b1f3e464

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
