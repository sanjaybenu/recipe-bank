const sequelize = require('../config/connection');
const { User, Recipe, Comment } = require('../models');
const bcrypt = require('bcrypt')// New to add

//*********** To Change *********** (use hashPassword fn in userData)//
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const seed = async () => {
  const userData = [
    {
      username: 'jacksong',
      email: 'jack@email.co',
      password: await hashPassword('123password')
    },
    {
      username: 'aligator',
      email: 'ali@email.co',
      password: await hashPassword('234password')
    },
    {
      username: 'jackandjill',
      email: 'jj@email.co',
      password: await hashPassword('345password')
    }
  ];

  const recipeData = [
    {
      name: 'Thali',
      recipe: 'Recipe 1 content',
      cuisine: 'Indian',
      food_img: 'https://c4.wallpaperflare.com/wallpaper/869/719/717/cuisine-food-india-indian-wallpaper-preview.jpg',
      user_id: 1
    },
    {
      name: 'Pizza',
      recipe: 'Recipe 2 content',
      cuisine: 'Italian',
      food_img: 'https://c4.wallpaperflare.com/wallpaper/234/543/684/food-pizza-wallpaper-preview.jpg',
      user_id: 2
    },
    {
      name: 'Tacos',
      recipe: 'Recipe 3 content',
      cuisine: 'Mexican',
      food_img: 'https://c4.wallpaperflare.com/wallpaper/570/745/92/comida-mexico-plato-tacos-wallpaper-preview.jpg',
      user_id: 1
    }
  ];

  await sequelize.sync({ force: true });
  await User.bulkCreate(userData);
  await Recipe.bulkCreate(recipeData);

  process.exit(0);
};

seed();




