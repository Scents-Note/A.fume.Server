'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PerfumeSurvey extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                foreignKey: {
                    name: 'perfumeIdx',
                    allowNull: false,
                },
                as: 'Perfume',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    PerfumeSurvey.init(
        {
            gender: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            modelName: 'PerfumeSurvey',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return PerfumeSurvey;
};
