const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const routes = require("./controller");
const sequelize = require("./config/connection");
/**-------------------------------------- */
const session = require("express-session");
const app = express();
const passport = require("passport");
/**-------------------------------------- ^^*/
const PORT = process.env.PORT || 3001;

require("dotenv").config();

const hbs = exphbs.create({});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/**-------------------------------------- */
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new (require("connect-session-sequelize")(session.Store))({
      db: sequelize,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  })
);

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());
/**-------------------------------------- */

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
