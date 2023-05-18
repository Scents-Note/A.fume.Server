'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

class IngredientCategories extends Model {}
IngredientCategories.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        usedCountOnPerfume: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'IngredientCategories',
        timestamps: true,
        underscored: true,
    }
);
module.exports = IngredientCategories;
