const express = require("express");
const path = require("path");
const layouts = require("express-ejs-layouts");

const passport = require("passport");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./db/helpers/init");
const WEEK = require("./config/time-constants");

const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

// Session store
const sessionStore = new SequelizeStore({
  db,
});

// Templates
app.use(layouts);
app.set("views", path.join(__dirname, "app/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");

// use static assets
app.use(express.static(__dirname + "/public"));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: WEEK,
    },
  })
);

sessionStore.sync();
app.use(passport.authenticate("session"));

// Routes
app.use("/", require("./config/routes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${host}/${port}`);
});
