const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cors = require("cors");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const app = express();

require("./config/passport")(passport);

app.use(cors());

mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB database connected"))
  .catch(err => console.log(err));
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Set Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
