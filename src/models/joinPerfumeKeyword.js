'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class JoinPerfumeKeyword extends Model {
        static associate(models) {
            models.Perfume.belongsToMany(models.Keyword, {
                through: 'JoinPerfumeKeyword',
                foreignKey: 'perfumeIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Keyword.belongsToMany(models.Perfume, {
                through: 'JoinPerfumeKeyword',
                foreignKey: 'keywordIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            models.Perfume.hasMany(this, {
                as: 'JoinPerfumeKeywords',
                foreignKey: 'perfumeIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            this.belongsTo(models.Keyword, {
                foreignKey: 'keywordIdx',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }
    JoinPerfumeKeyword.init(
        {
            perfumeIdx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            keywordIdx: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            modelName: 'JoinPerfumeKeyword',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
    return JoinPerfumeKeyword;
};
