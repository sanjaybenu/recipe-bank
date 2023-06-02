const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Recipe extends Model {}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipe: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cuisine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    food_img:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "recipe",
  }
);

module.exports = Recipe;