require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const authRouter = require('./routes/auth');
const clientRouter = require('./routes/client');
const flash = require('connect-flash');
const app = express();
const MongoDBStore = require('connect-mongodb-session')(session);
const compression = require('compression');
app.use(compression());
mongoose.set('useCreateIndex', true);


const urlConnect = process.env.DB;

// Connect to database
mongoose.connect(
  urlConnect,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("Connect successfullyy!!");
  }
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: "notsecret",
    saveUninitialized: true,
    resave: false,
    store: new MongoDBStore({ uri: process.env.DB, collection: "session" }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(clientRouter);
app.use(authRouter);

// pass passport for configuration
require("./config/passport")(passport);

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
  res.render("error", {});
});

module.exports = app;
