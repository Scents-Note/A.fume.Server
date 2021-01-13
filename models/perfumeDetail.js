'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PerfumeDetail extends Model {
        static associate(models) {
            models.Perfume.hasOne(this, {
                foreignKey: 'perfumeIdx',
            });
        }
    }
    PerfumeDetail.init(
        {
            perfumeIdx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            story: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            abundanceRate: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: '코롱/오 드 코롱/코롱 인텐스/오 드 퍼퓸/오 드 뚜왈렛',
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            volumeAndPrice: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            modelName: 'PerfumeDetail',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return PerfumeDetail;
};
