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
    name: 'cuisine1',
    recipe: 'Recipe 1 content',
    cuisine: 'Indian',
    user_id: 1
  },
  {
    name: 'cuisine2',
    recipe: 'Recipe 2 content',
    cuisine: 'Italian',
    user_id: 2
  },
  {
    name: 'cuisine3',
    recipe: 'Recipe 3 content',
    cuisine: 'Mexican',
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



