const express = require("express");
const router = express.Router();
const { User, Recipe, Comment } = require("../models");

// ****** Landing Page and Register Routes *****

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// ******** User Routes *********

router.get("/users", async (req, res) => {
  const userData = await User.findAll({ include: [{ model: Recipe }] });
  const users = userData.map((user) => user.get({ plain: true }));
  //res.json(users)
  res.render("users", { users });
  //res.render('register')
});

router.get("/user/:id", async (req, res) => {
  const recipeData = await Recipe.findAll({
    include: [{ model: Comment }, { model: User }],
    where: { user_id: req.params.id },
  });
  const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));
  //console.table(recipes)
  if (recipes.length === 0) {
    res.render("norecipe");
  }
  res.render("recipes", { recipes });
  //res.json(recipes);
  //res.render('users',{users})
  //res.render('register')
});

router.post("/user", async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    await User.create(user);
    res.status(200).json({ Success: "New User Created" });
  } catch (err) {
    res.status(500).json({ Error: "Something Went Wrong" });
  }
});

//********** Recipe Routes *************

router.get("/recipe/:id", async (req, res) => {
  const recipeData = await Recipe.findAll({
    include: [{ model: Comment }],
    where: { id: req.params.id },
  });
  const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));
  res.json(recipes);
  //console.table(recipes)
  //res.render('users',{users})
  //res.render('register')
});

// router.get('/user', async(req , res)=>{
//     const userData = await User.findAll({where:{
//         username: 'jacksong'
//     }})
//     const id = userData[0].id
//    // const users = userData.map((user)=>user.get({plain:true}))
//     res.json({id:`${id}`})
//     //res.json(userData)
//     //res.render('users',{users})
//     //res.render('register')
// });

router.get("/recipe", async (req, res) => {
  const recipeData = await Recipe.findAll({
    where: {
      name: "cuisine1",
    },
  });
  const id = recipeData[0].id;
  // const users = userData.map((user)=>user.get({plain:true}))
  res.json({ id: `${id}` });
  //res.json(userData)
  //res.render('users',{users})
  //res.render('register')
});

router.post("/recipe", async (req, res) => {
  // const recipe = await Recipe.findOne({where:
  //  { name: req.body.name}});
  //  const recipeId = recipe.dataValues.id
  const user = await User.findOne({ where: { username: req.body.username } });
  const userId = user.id;
  // console.log(userId)
  const newRecipe = {
    name: req.body.name,
    recipe: req.body.recipe,
    cuisine: req.body.cuisine,
    user_id: userId,
  };
  Recipe.create(newRecipe);
  res.status(200).json({ Success: "Recipe Created" });
});

// *********** Comments Routes **************

router.get("/comments", async (req, res) => {
  const comments = await Comment.findAll({
    include: [{ model: User }, { model: Recipe }],
  });

  res.status(200).json(comments);
});

router.get("/comments/:id", async (req, res) => {
  const comments = await Comment.findAll({
    include: [{ model: User }, { model: Recipe }],
    where: {
      recipe_id: req.params.id,
    },
  });
  res.status(200).json(comments);
});

// ************ check how to extract data ************** //
router.get("/comments/:id", async (req, res) => {
  const recipeId = req.params.id;
  const comments = await Comment.findAll({
    where: {
      recipe_id: recipeId,
    },
  });
  const userNamePromises = comments.map((user) =>
    User.findOne({
      where: {
        id: user.user_id,
      },
    })
  );
  const users = await Promise.all(userNamePromises);
  const userNames = users.map((user) => user.username);
  const data = [comments, userNames];
  res.status(200).json(data);
});

router.post("/comments", async (req, res) => {
  const recipe = await Recipe.findOne({ where: { name: req.body.name } });
  const recipeId = recipe.dataValues.id;
  const user = await User.findOne({ where: { username: req.body.username } });
  const userId = user.id;
  // console.log(userId)
  const newComment = {
    comment: req.body.comment,
    recipe_id: recipeId,
    user_id: userId,
  };
  Comment.create(newComment);
  res.status(200).json({ Success: "Comment Created" });
});

router.post("/comments", async (req, res) => {
  const recipe = await Recipe.findOne({ where: { name: req.body.name } });
  const recipeId = recipe.dataValues.id;
  const user = await User.findOne({ where: { username: req.body.username } });
  const userId = user.id;
  // console.log(userId)
  const newComment = {
    comment: req.body.comment,
    recipe_id: recipeId,
    user_id: userId,
  };
  Comment.create(newComment);
  res.status(200).json({ Success: "Comment Created" });
});

//*****************************************
//**********                       ********
//**********     Test Routes       ********
//**********                       ********
//*****************************************
router.get("/test/:id", async (req, res) => {
  try {
    const user = await Comment.findAll({
      where: {
        recipe_id: req.params.id,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

router.post("/test", async (req, res) => {
  //create variables for user_id and recipe_id
  try {
    const user = await Comment.create({
      user_id: userId, // use username for userId
      recipe_id: recipeId, // use recipe  name for recipe id
      comment: comment,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

module.exports = router;
