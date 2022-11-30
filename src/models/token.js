'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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
    return Token;
};
