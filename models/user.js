module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('user', {
        userIdx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            field: 'user_idx'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
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
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '0: USER, 1: ADMIN',
            defaultValue: 0
        },
    }, {
        timestamps:true,
    });
};
