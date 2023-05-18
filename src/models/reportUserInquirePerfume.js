'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');
class ReportUserInquirePerfume extends Model {}
ReportUserInquirePerfume.init(
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
        modelName: 'ReportUserInquirePerfume',
        timestamps: true,
        underscored: true,
        sequelize,
        freezeTableName: true,
        tableName: 'report_user_inquire_perfume',
    }
);
module.exports = ReportUserInquirePerfume;
