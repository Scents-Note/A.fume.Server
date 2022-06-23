'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        static associate(models) {
            this.belongsTo(models.Series, {
                foreignKey: 'seriesIdx',
                as: 'Series',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });

            this.hasOne(models.IngredientCategories, {
                foreignKey: 'categoryIdx',
                as: 'IngredientCategories',
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            });
        }
    }
    Ingredient.init(
        {
            ingredientIdx: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            englishName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryIdx: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Ingredient',
            timestamps: true,
            underscored: true,
        }
    );
    return Ingredient;
};
