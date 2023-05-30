const bcrypt = require("crypto");

function genPassword(password) {
  var password = bcrypt.randomBytes(32).toString("hex");

  return {
    password: password,
  };
}

module.exports = genPassword;
