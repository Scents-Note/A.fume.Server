'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        static associate(models) {
            Ingredient.hasOne(models.Series, {
                foreignKey: {
                    name: 'seriesIdx',
                    allowNull: false,
                },
                as: 'Series',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
            seriesIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
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
