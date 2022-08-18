'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InquireHistory extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                as: 'Perfume',
                foreignKey: 'perfumeIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    InquireHistory.init(
        {
            userIdx: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            perfumeIdx: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            routes: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            modelName: 'InquireHistory',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return InquireHistory;
};
