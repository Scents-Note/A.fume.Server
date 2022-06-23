'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class IngredientCategories extends Model {}
    IngredientCategories.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'IngredientCategories',
            timestamps: true,
            underscored: true,
        }
    );
    return IngredientCategories;
};
