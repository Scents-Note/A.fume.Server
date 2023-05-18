'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');
class Series extends Model {}
Series.init(
    {
        seriesIdx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
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
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        modelName: 'Series',
        paranoid: true,
        timestamps: true,
        underscored: true,
        sequelize,
    }
);
module.exports = Series;
