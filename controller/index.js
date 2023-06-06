const express = require("express");
const router = express.Router();
var moment = require('moment');
const { User, Recipe, Comment } = require("../models");

// ****** Landing Page  *****

router.get("/", (req, res) => {
res.render("landingpage",{loggedIn:req.session.loggedIn});
});

// ****** recipes page  *****

router.get("/recipes", async (req, res) => {
    const recipeData = await Recipe.findAll({ include: [{ model: User }] });
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));
    
      res.render("recipes",{recipes, loggedIn: req.session.loggedIn})
  });


// ****** users page  *****

router.get("/users", async (req, res) => {
    const userData = await User.findAll({ include: [{ model: Recipe }] });
    const users = userData.map((user) => user.get({ plain: true }));
      res.render("users", { users, loggedIn: req.session.loggedIn})
   
  });


// ****** Add recipe page  *****

router.get("/add-recipe", (req, res) => {
  res.render("addRecipe", {loggedIn:req.session.loggedIn})
});

router.post('/add-recipes', async(req, res)=>{

  const user = await User.findOne({
      where:{
          username: req.body.username
      }
  })

  // fill up the new code
  const userId = user.id
  const newRecipe ={
      name: req.body.name,
      recipe: req.body.recipe,
      food_img: req.body.food_img,
      cuisine: req.body.cuisine,
      user_id: userId

  }
 console.log(newRecipe)
   await Recipe.create(newRecipe);
   const recipe =await Recipe.findOne({
      where:{
          name: req.body.name
      }
   })
   const id = recipe.id
//    res.json({newId: `${id}`})// to be commented out for render
   res.redirect(`/recipes/${id}`) //to be decommented for render
})



// ****** recipe page  *****

router.get('/recipes/:id', async (req, res) => {
    try {
      const recipe = await Recipe.findOne({
        include: [{ model: User }, { model: Comment }],
        where: {
          id: req.params.id
        }
      });
  
      if (!recipe) {
        console.log('No recipe found');
        res.render('norecipe')
        // You might want to handle this case appropriately, such as showing an error message
      }
  
      const renderRecipe = recipe.get({ plain: true });
      
   //  res.json(renderRecipe)
   res.render('dish', { renderRecipe,loggedIn:req.session.loggedIn});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  });

// comment post


router.post('/comments', async(req, res)=>{

    const user = await User.findOne({
        where:{
            username: req.body.username
        }
    })

    const userId = user.id
    
    const recipe = await Recipe.findOne({
        where:{
            name: req.body.recipeName
        }
    })

    const recipeId = recipe.id

  //  console.log(`Recipe id is ${recipeId}`)
    const newComment = {
        comment: req.body.comment,
        timestamp: req.body.timestamp,
        user_id : userId,
        recipe_id: recipeId
    }
    // fill up the new code

     await Comment.create(newComment);
    //  res.json(newComment)// comment out for rendering
    res.redirect(`/recipes/${recipeId}`)// Decomment to render

  })


// ****** register *****

router.get("/register", (req, res) => {
  res.render("register");
});

router.post('/register', async(req, res)=>{

    const existingUser = await User.findAll({
        where:{
            username: req.body.username
        }
    })
    //console.log(existingUser)
    if (existingUser.length!=0){
        res.render('existinguser')
       // res.json({error:'You are already registered please login'})
    }
    else{

   // const hashedPassword = req.body.password // do hashing here

     const newUser = { 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
     }

     User.create(newUser);
    // res.render('landingpage')
     req.session.save(() => {
      req.session.loggedIn = true;

      res.redirect('/');
     })
    }
     
  })


// ****** login *****
router.get("/login", (req, res) => {
    res.render("login");

})
router.post('/login', async(req,res)=> {
  const dbUserData = await User.findOne({
    where: {
      username: req.body.username
    },
  });

  if (!dbUserData) {
    res
      .status(400)
      .render('nouser');
    return;
  }

  const validPassword = await dbUserData.checkPassword(req.body.password);

  if (!validPassword) {
    res
      .status(400)
      .render('nouser');
    return;
  }

  req.session.save(() => {
    req.session.loggedIn = true;

    res
      .status(200)
      .redirect('/');
  });

  })


  // logout route
  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });


  module.exports = router;
