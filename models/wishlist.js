'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Wishlist extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                foreignKey: 'perfumeIdx',
                targetKey: 'perfumeIdx',
                as: 'Perfume',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.User.belongsToMany(models.Perfume, {
                as: 'MyWishList',
                through: 'Wishlist',
                foreignKey: 'userIdx',
                otherKey: 'perfumeIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    Wishlist.init(
        {
            userIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            perfumeIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            priority: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            modelName: 'Wishlist',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return Wishlist;
};
