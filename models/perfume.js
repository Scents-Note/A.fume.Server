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
                onDelete: 'CASCADE',
            });
            Perfume.belongsTo(models.Series, {
                foreignKey: {
                    name: 'mainSeriesIdx',
                    allowNull: false,
                },
                as: 'MainSeries',
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
