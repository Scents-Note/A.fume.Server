'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SearchHistory extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                foreignKey: {
                    name: 'perfumeIdx',
                    allowNull: false,
                    primaryKey: true,
                },
                as: 'perfume',
                onDelete: 'CASCADE',
            });
            this.belongsTo(models.User, {
                foreignKey: {
                    name: 'userIdx',
                    allowNull: false,
                    primaryKey: true,
                },
                as: 'user',
                onDelete: 'CASCADE',
            });
        }
    }
    SearchHistory.init(
        {
            userIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            perfumeIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false,
            },
        },
        {
            modelName: 'SearchHistory',
            timestamps: false,
            underscored: true,
            sequelize,
        }
    );
    return SearchHistory;
};
