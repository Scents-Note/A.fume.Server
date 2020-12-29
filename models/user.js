const Sequelize = require('sequelize');

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('user', {
        userIdx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '1: 남자, 2: 여자'
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birth: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '0: USER, 1: 게시판 운영자 9: 시스템 관리자',
            defaultValue: 0
        },
        accessTime: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        }
    }, {
        timestamps:true,
        underscored: true,
    });
};
