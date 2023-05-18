'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

class Token extends Model {}
Token.init(
    {
        accessToken: {
            type: DataTypes.STRING(500),
            allowNull: false,
            primaryKey: true,
        },
        refreshToken: {
            type: DataTypes.STRING(500),
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        modelName: 'Token',
        timestamps: true,
        underscored: true,
        sequelize,
    }
);
module.exports = Token;
