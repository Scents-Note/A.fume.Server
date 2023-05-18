'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

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
            unique: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        story: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        abundanceRate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment:
                '0: None, 1: 코롱, 2: 오 드 코롱, 3: 오 드 뚜왈렛, 4: 오 드 퍼퓸, 5: 퍼퓸, 6: 기타',
        },
        volumeAndPrice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        modelName: 'Perfume',
        paranoid: true,
        timestamps: true,
        underscored: true,
        sequelize,
    }
);
module.exports = Perfume;
