'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Perfume extends Model {
        static associate(models) {
            Perfume.belongsTo(models.Brand, {
                foreignKey: {
                    name: 'brandIdx',
                    allowNull: false,
                },
                as: 'Brand',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            });
            Perfume.belongsTo(models.Series, {
                foreignKey: {
                    name: 'mainSeriesIdx',
                    allowNull: false,
                },
                as: 'MainSeries',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            });
            Perfume.hasOne(models.PerfumeDetail, {
                foreignKey: 'perfumeIdx',
                as: 'PerfumeDetail',
            });
            Perfume.hasOne(models.PerfumeSurvey, {
                foreignKey: 'perfumeIdx',
                as: 'PerfumeSurvey',
            });
            Perfume.hasMany(models.LikePerfume, {
                as: 'Wishlist',
                sourceKey: 'perfumeIdx',
                foreignKey: 'perfumeIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    Perfume.init(
        {
            perfumeIdx: {
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
            imageThumbnailUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            releaseDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            likeCnt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            modelName: 'Perfume',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return Perfume;
};
