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
            Perfume.hasOne(models.PerfumeDetail, {
                foreignKey: 'perfumeIdx',
                as: 'PerfumeDetail',
            });
            Perfume.hasOne(models.PerfumeSurvey, {
                foreignKey: 'perfumeIdx',
                as: 'PerfumeSurvey',
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
            imageUrl: {
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
