'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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
    return Keyword;
};
