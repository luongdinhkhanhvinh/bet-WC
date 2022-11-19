// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// // var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// // app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler

const express = require("express");
const hbs = require("hbs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const passport = require("passport");
const compression = require("compression");
const csrf = require("csurf");
const fs = require("fs");
const helmet = require("helmet");
const ms = require("ms");
const morgan = require("morgan");
const flash = require("connect-flash");
const packageJson = require("./package.json");
const config = require("./config");
const { knex } = require("./db");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  knex("user_account")
    .where({ id: id })
    .select(
      "id",
      "name",
      "email",
      "admin",
      "past_matches_last_visited_at",
      "google_id as googleId",
      "facebook_id as facebookId"
    )
    .first()
    .then((user) => done(null, user))
    .catch((err) => done(err, false));
});

hbs.registerPartials(__dirname + "/views/partials");

const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.set("trust proxy", config.trustProxy);
app.disable("x-powered-by");
app.enable("strict routing");
app.enable("case sensitive routing");

app.locals.origin = config.origin;
hbs.localsAsTemplateData(app);

require("./hbs_helpers.js")();

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(compression());
require("./routes/static.js")(app);
app.use("/static", express.static(__dirname + "/static"));
app.use(express.static(__dirname + "/assets/images"));
app.use(express.static(__dirname + "/webroot"));

// Logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      baseUri: ["'self'"],
      defaultSrc: ["'none'"],
      scriptSrc: [
        "'self'",
        "https://www.google.com/recaptcha/",
        "https://www.gstatic.com/recaptcha/",
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      formAction: ["'self'"],
      childSrc: ["https://www.google.com/recaptcha/"],
      frameAncestors: ["'none'"],
    },
    // setAllHeaders: false,
    // browserSniff: false,
  })
);
app.use(
  helmet.frameguard({
    action: "deny",
  })
);
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(express.urlencoded({ extended: false }));

const store = new KnexSessionStore({
  knex,
  tablename: "session",
  createtable: false, // don't auto-create the table
  clearInterval: ms("10 min"),
});

app.use(
  session({
    name: "sid",
    secret: config.sessionSecret,
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: !!config.https,
      maxAge: ms("30 days"),

      // sameSite=strict does not seem to work well with Google OAuth
      sameSite: "lax",
    },
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["*"],
    },
  })
);
app.use(flash());
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

app.use(require("./routes"));

app.listen(config.httpPort, function () {
  console.log("Visit %s", config);
});

module.exports = app;
