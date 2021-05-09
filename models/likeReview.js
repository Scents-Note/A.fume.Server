'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LikeReview extends Model {
        static associate(models) {
            models.User.belongsToMany(models.Review, {
                through: 'UserReview',
                foreignKey: 'userIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Review.belongsToMany(models.User, {
                through: 'ReviewUser',
                foreignKey: 'reviewIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Review.hasMany(this, {
                foreignKey: 'reviewIdx',
                as: 'ReviewLike',
                sourceKey: 'id',
            });
            this.belongsTo(models.Review, {
                foreignKey: 'reviewIdx',
                as: 'LikeToReview',
                targetKey: 'id',
            });
        }
    }
    LikeReview.init(
        {
            userIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            reviewIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
        },
        {
            modelName: 'LikeReview',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return LikeReview;
};
