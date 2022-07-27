'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                foreignKey: {
                    name: 'perfumeIdx',
                    allowNull: false,
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            this.belongsTo(models.User, {
                foreignKey: {
                    name: 'userIdx',
                    allowNull: false,
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.User.hasMany(this, {
                foreignKey: {
                    name: 'userIdx',
                    allowNull: false,
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    Review.init(
        {
            score: {
                type: DataTypes.FLOAT,
                allowNull: false,
                comment: '0.5 ~ 5.0',
            },
            longevity: {
                type: DataTypes.INTEGER,
                comment:
                    '1: 매우 약함, 2: 약함, 3: 보통, 4: 강함, 5: 매우 강함',
            },
            sillage: {
                type: DataTypes.INTEGER,
                comment: '1: 가벼움, 2: 보통, 3: 무거움',
            },
            seasonal: {
                type: DataTypes.INTEGER,
                comment: '1: 봄, 2: 여름, 3: 가을, 4: 겨울',
            },
            gender: {
                type: DataTypes.INTEGER,
                comment: '1: 남성, 2: 중성, 3: 여성',
            },
            access: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: '0: false, 1: true',
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            likeCnt: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            modelName: 'Review',
            paranoid: true,
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return Review;
};
