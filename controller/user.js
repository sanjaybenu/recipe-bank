//const express = require("express");
// router = express.Router();
////const passport = require("passport");

//

//

const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../utils/passwordUtils").genPassword;
const Sequelize = require("sequelize");
const { User } = require("../models/User");

// ******** log in/log out Routes *********

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

router.post("/register", (req, res, next) => {
  const newUserData = genPassword(req.body.pw);

  const username = newUserData.bcrypt;
  const password = newUserData.bcrypt;

  const newUser = new User({
    username: username,
    password: password,
  });

  newUser.save().then((user) => {
    console.log(user);
  });

  res.redirect("/login");
});

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
