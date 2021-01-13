'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {}
    Brand.init(
        {
            brandIdx: {
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
            startCharacter: {
                type: DataTypes.CHAR(1),
                allowNull: false,
                comment: '첫글자 카테고리',
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
            modelName: 'Brand',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return Brand;
};
