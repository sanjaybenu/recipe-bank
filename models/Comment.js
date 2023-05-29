const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection')

class Comment extends Model {}

Comment.init( 
    {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'User',
            key: 'id'
        }
    },
    recipe_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Recipe',
            key: 'id'
        }
    }

},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment', 
}
);

module.exports = Comment;