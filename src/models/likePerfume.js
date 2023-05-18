'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');
class likePerfume extends Model {
    static associate(models) {
        models.User.belongsToMany(models.Perfume, {
            foreignKey: 'perfumeIdx',
            through: 'LikePerfume',
            as: 'MyLikePerfumes',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        models.Perfume.belongsToMany(models.User, {
            foreignKey: 'userIdx',
            through: 'LikePerfume',
            as: 'LikedUsers',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        models.Perfume.hasMany(models.LikePerfume, {
            as: 'LikePerfume',
            sourceKey: 'perfumeIdx',
            foreignKey: 'perfumeIdx',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    }
}
likePerfume.init(
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
    },
    {
        sequelize,
        modelName: 'LikePerfume',
        timestamps: true,
        underscored: true,
    }
);
module.exports = likePerfume;
