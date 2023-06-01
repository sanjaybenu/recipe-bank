const sequelize = require('../config/connection');
const { User, Recipe, Comment } = require('../models');

const userData = [
  {
    username: 'jacksong',
    email: 'jack@email.co',
    password: '123password'
  },
  {
    username: 'aligator',
    email: 'ali@email.co',
    password: '234password'
  },
  {
    username: 'jackandjill',
    email: 'jj@email.co',
    password: '345password'
  }
];

const recipeData = [
  {
    name: 'dish1',
    recipe: 'Recipe 1 content',
    cuisine: 'Indian',
    food_img:'https://c4.wallpaperflare.com/wallpaper/869/719/717/cuisine-food-india-indian-wallpaper-preview.jpg',
    user_id: 1
  },
  {
    name: 'dish2',
    recipe: 'Recipe 2 content',
    cuisine: 'Italian',
    food_img:'https://c4.wallpaperflare.com/wallpaper/234/543/684/food-pizza-wallpaper-preview.jpg',
    user_id: 2
  },
  {
    name: 'dish 3',
    recipe: 'Recipe 3 content',
    cuisine: 'Mexican',
    food_img:'https://c4.wallpaperflare.com/wallpaper/570/745/92/comida-mexico-plato-tacos-wallpaper-preview.jpg',
    user_id: 1
  }
];

const commentData = [
  {
    comment: 'Comment 1',
    recipe_id: 1,
    user_id: 2
  },
  {
    comment: 'Comment 2',
    recipe_id: 1,
    user_id: 3
  },
  {
    comment: 'Comment 3',
    recipe_id: 3,
    user_id: 3
  }
];

const seed = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(userData);
  await Recipe.bulkCreate(recipeData);
  await Comment.bulkCreate(commentData);

  process.exit(0);
};

seed();



