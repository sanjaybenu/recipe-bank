const express = require("express");
const router = express.Router();
const { User, Recipe, Comment } = require("../models");

// ****** Landing Page  *****

router.get("/", (req, res) => {
  res.render("landingpage", {
    loggedIn: req.session.loggedIn,
    username: req.session.username,
  });
});

// ****** recipes page  *****

router.get("/recipes", async (req, res) => {
  const recipeData = await Recipe.findAll({ include: [{ model: User }] });
  const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));

  res.render("recipes", {
    recipes,
    loggedIn: req.session.loggedIn,
    username: req.session.username,
  });
});

// ****** users page  *****

router.get("/users", async (req, res) => {
  const userData = await User.findAll({ include: [{ model: Recipe }] });
  const users = userData.map((user) => user.get({ plain: true }));
  res.render("users", {
    users,
    loggedIn: req.session.loggedIn,
    username: req.session.username,
  });
});

// ****** Add recipe page  *****

router.get("/add-recipe", (req, res) => {
  res.render("addRecipe", {
    loggedIn: req.session.loggedIn,
    username: req.session.username,
  });
});

router.post("/add-recipes", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  const userId = user.id;
  const newRecipe = {
    name: req.body.name,
    recipe: req.body.recipe,
    food_img: req.body.food_img,
    cuisine: req.body.cuisine,
    user_id: userId,
  };
  await Recipe.create(newRecipe);
  res.redirect("/recipes");
});



//****************************NEW Recipe id Route ******************//

router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      include: [
        { model: User, attributes: ["username"], as: "user" },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["username"],
              as: "user",
              foreignKey: "user_id",
            },
          ],
        },
      ],
      where: { id: req.params.id },
    });

    const renderRecipe = recipe.get({ plain: true });
    console.log(renderRecipe);

    res.render("dish", {
      renderRecipe,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(`<h2>No Recipe Found</h2><a href="/">click to go back</a>`);
  }
});

// comment post

router.post("/comments", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  const userId = user.id;

  const recipe = await Recipe.findOne({
    where: {
      name: req.body.recipeName,
    },
  });

  const recipeId = recipe.id;

  const newComment = {
    comment: req.body.comment,
    timestamp: req.body.timestamp,
    user_id: userId,
    recipe_id: recipeId,
  };
  await Comment.create(newComment);
  res.redirect(`/recipes/${recipeId}`);
});

// ****** register *****

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const existingUser = await User.findAll({
    where: {
      username: req.body.username,
    },
  });

  if (existingUser.length != 0) {
    res.render("existinguser");
  } else {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    User.create(newUser);
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      res.redirect("/");
    });
  }
});

// ****** login *****
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  const dbUserData = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!dbUserData) {
    res.status(400).render("nouser");
    return;
  }
  const validPassword = await dbUserData.checkPassword(req.body.password);

  if (!validPassword) {
    res.status(400).render("nouser");
    return;
  }

  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.username = req.body.username;
    res.status(200).redirect("/");
  });
});

// logout route
router.post("/logout", (req, res) => {
  console.log("Route can be accessed");
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
