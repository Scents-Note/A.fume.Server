'use strict';

const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

class ReportReview extends Model {
    static associate(models) {
        models.User.belongsToMany(models.Review, {
            through: 'ReportReview',
            foreignKey: 'reporterIdx',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        models.Review.belongsToMany(models.User, {
            through: 'ReportReview',
            foreignKey: 'reviewIdx',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    }
}
ReportReview.init(
    {
        reporterIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        reviewIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        modelName: 'ReportReview',
        timestamps: true,
        underscored: true,
        sequelize,
    }
);
module.exports = ReportReview;
