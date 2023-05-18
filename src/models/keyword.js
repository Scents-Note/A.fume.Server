'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

class Keyword extends Model {}
Keyword.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        modelName: 'Keyword',
        paranoid: true,
        underscored: true,
        sequelize,
    }
);
module.exports = Keyword;
