'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Note extends Model {
        static associate(models) {
            models.Ingredient.hasMany(this, {
                foreignKey: 'ingredientIdx',
                sourceKey: 'ingredientIdx',
                as: 'Notes',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Perfume.hasMany(this, {
                foreignKey: 'perfumeIdx',
                sourceKey: 'perfumeIdx',
                as: 'Notes',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            this.hasOne(models.Ingredient, {
                foreignKey: 'ingredientIdx',
                sourceKey: 'ingredientIdx',
                as: 'Ingredients',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    Note.init(
        {
            perfumeIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            ingredientIdx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            paranoid: true,
            timestamps: true,
            underscored: true,
            modelName: 'Note',
        }
    );
    return Note;
};
