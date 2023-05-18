'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

class JoinReviewKeyword extends Model {
    static associate(models) {
        models.Review.belongsToMany(models.Keyword, {
            through: 'JoinReviewKeyword',
            foreignKey: 'reviewIdx',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        models.Keyword.belongsToMany(models.Review, {
            through: 'JoinReviewKeyword',
            foreignKey: 'keywordIdx',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        this.belongsTo(models.Keyword, {
            foreignKey: 'keywordIdx',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    }
}
JoinReviewKeyword.init(
    {
        reviewIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        keywordIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        modelName: 'JoinReviewKeyword',
        timestamps: true,
        underscored: true,
        sequelize,
    }
);
module.exports = JoinReviewKeyword;
