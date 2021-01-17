'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class joinSeriesIngredient extends Model {
        static associate(models) {
            models.Series.belongsToMany(models.Ingredient, {
                foreignKey: 'seriesIdx',
                through: 'JoinSeriesIngredient',
                as: 'Ingredients',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Ingredient.belongsToMany(models.Series, {
                foreignKey: 'ingredientIdx',
                through: 'JoinSeriesIngredient',
                as: 'Series',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    joinSeriesIngredient.init(
        {
            ingredientIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
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
            modelName: 'JoinSeriesIngredient',
            timestamps: true,
            underscored: true,
        }
    );
    return joinSeriesIngredient;
};
