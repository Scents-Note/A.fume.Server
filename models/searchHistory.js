'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SearchHistory extends Model {
        static associate(models) {
            models.User.belongsToMany(models.Perfume, {
                foreignKey: 'userIdx',
                through: 'SearchHistory',
                as: 'SearchedPerfumes',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Perfume.belongsToMany(models.User, {
                foreignKey: 'perfumeIdx',
                through: 'SearchHistory',
                as: 'SearchingUsers',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            this.belongsTo(models.Perfume, {
                foreignKey: 'perfumeIdx',
                as: 'Perfume',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Perfume.hasMany(this, {
                foreignKey: 'perfumeIdx',
                as: 'SearchHistory',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            this.belongsTo(models.User, {
                foreignKey: 'userIdx',
                as: 'User',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.User.hasMany(this, {
                foreignKey: 'userIdx',
                as: 'SearchHistory',
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
                allowNull: false,
            },
            perfumeIdx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        },
        {
            modelName: 'SearchHistory',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return SearchHistory;
};
