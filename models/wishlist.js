'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Wishlist extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                foreignKey: {
                    name: 'perfumeIdx',
                    allowNull: false,
                    primaryKey: true
                },
                as: 'Perfume',
                onDelete: 'CASCADE'
            });
            this.belongsTo(models.User, {
                foreignKey: {
                    name: 'userIdx',
                    allowNull: false,
                    primaryKey: true
                },
                as: 'User',
                onDelete: 'CASCADE'
            });
        }
    };
    Wishlist.init({
        userIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        perfumeIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        modelName: 'Wishlist',
        timestamps: true,
        underscored: true,
        sequelize,
    });
    return Wishlist;
};