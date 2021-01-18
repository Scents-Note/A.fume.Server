'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SearchHistory extends Model {
        static associate(models) {
            this.belongsTo(models.Perfume, {
                foreignKey: 'perfumeIdx',
                as: 'Perfume',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.User.belongsToMany(models.Perfume, {
                as: 'MySearchHistories',
                through: 'SearchHistory',
                foreignKey: 'userIdx',
                otherKey: 'perfumeIdx',
                onUpdate: 'CASCADE',
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
