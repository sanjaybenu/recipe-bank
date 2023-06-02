// const express = require("express");
// const router = express.Router();
// const { User,Recipe,Comment } = require("../models");

// ************** Routes for the main page ***************
router.get("/", (req, res) => {
    // console.log('I am the route for the landing page')
    // res.json({msg:'I will render the landing page'})
    res.render("login");
  });

  router.get("/login", (req, res) => {
    console.log('I am the route for the login page')
    res.json({msg:'I will render the landing page'})
    res.render("loginpage");
  })
  
  router.get("/register", (req, res) => {
    // console.log('I am the route for registration page')
  //   res.json({msg:'I will render the registration page'})
   res.render("register");
  });

  //*********Route for login in ***************
  // ********** check again tomorrow **********

  router.post('/login', async(req,res)=> {
    const user = await User.findAll({
        where:{
            username: req.body.username
        }
    }
    )
    if (user.length===0){
        res.json({msg:'No user found'})
        //res.render('/nouser')
    }else{
        const hashPassword = req.body.password
        
        const password = await User.findAll ({
         where:{
            password: hashPassword

         }   
        }) 
        console.log(password)
        if(password.length===0){
           // res.render('/wrongpassword')
           res.json({msg:'Password do not match'})
        }
        else{
            res.redirect('/')
            const loggedIn = true;
            return loggedIn;
        }
    } 
  })

  //************ Route for Registration ****************

  router.post('/register', async(req, res)=>{

    const existingUser = await User.findAll({
        where:{
            username: req.body.username
        }
    })
    console.log(existingUser)
    if (existingUser.length!=0){
        //res.render('existinguser')
        res.json({error:'You are already registered please login'})
    }
    else{

    const hashedPassword = req.body.password // do hashing here

     const newUser = { 
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
     }

     User.create(newUser);
     res.redirect('/')
    }
  })


  //*********** Routes for Users (1. list of users, 2.list of recipes individual user) ***************//

  router.get('/users', async(req, res)=>{

    const usersData = await User.findAll({
        include:{
            model: Recipe
        }
    })

    const users =usersData.map((user)=>user.get({plain: true}))
   // res.render('users',{users})
    res.json(users)
  })

  router.get('/users/:id', async(req, res)=>{

    const userData = await User.findOne({

        include:[{model: Recipe},{model: Comment}],
        where:{
            id: req.params.id
        }

    })
    const user = userData.get({plain:true})
    console.log(user.recipes[0].name)
  res.render('user',{user})
  //res.json(user)
  })


  //*************** Routes for Recipes (recipe page name, cuisine, description, comments) **********//
  router.get('/recipes', async(req, res)=>{

    const recipesData = await Recipe.findAll({
        include:[{model: Comment},{model:User}]
    })

    const recipes = recipesData.map((recipe)=>
        recipe.get({plain:true}
        ))
   //res.json(recipes)
   res.render('recipes',{recipes})
  })

  router.get('/recipes/:id', async(req, res)=>{

    const recipe = await Recipe.findOne({

        include:[{model: User},{model: Comment}],
        where:{
            id: req.params.id
        }

    })
    //console.log(recipe.comments.comment);
    const renderRecipe =recipe.get({plain:true})
   res.render('recipe',{renderRecipe})
  // res.json(renderRecipe)
  })

  //******* Route for getting a comment ***********/
  router.get('/comments/:id', async(req, res)=>{
    const commentData =await Comment.findOne({
        include:[{model:User},{model:Recipe}],
        where:{
            id: req.params.id
        }  
    })
    const comment = commentData.get({plain:true})
    res.json(comment)
  })

  //*************** Routes for posting Recipes *********************//

  router.post('/recipes', async(req, res)=>{

    const user = await User.findOne({
        where:{
            username: req.body.username
        }
    })

    //fill up the new code
    const userId = user.id
    const newRecipe ={
        name: req.body.name,
        recipe: req.body.recipe,
        cuisine: req.body.cuisine,
        user_id: userId

    }

     await Recipe.create(newRecipe);
     const recipeData =await Recipe.findOne({
        where:{
            name: req.body.name
        }
     })

     const recipe = recipeData.get({plain: true})

     //const id = recipe.id
     res.json(recipe)// to be commented out for render
     //await Recipe
     //res.redirect(`/recipes/:${id}`) to be decommented for render
  })

  //*************** Routes for posting Comments ***********************//

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
    console.log(`Recipe id is ${recipeId}`)
    const newComment = {
        comment: req.body.comment,
        user_id : userId,
        recipe_id: recipeId
    }
    // fill up the new code

     await Comment.create(newComment);
     res.json(newComment)// comment out for rendering
    // res.redirect(`/recipes/:${recipeId}`)// Decomment to render
  })


//   module.exports = router;