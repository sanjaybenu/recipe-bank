const sequelize = require("../config/connection");
const { DataTypes } = require("sequelize");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ where: { username: username } });
      if (!user) {
        return done(null, false, { message: "incorrect username." });
      }

      const passVal = user.validPassword(password);
      if (!passVal) {
        return done(null, false, { message: "incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
      done(null, user);
    });
  });
};
