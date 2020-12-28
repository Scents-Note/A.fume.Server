module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('brand', {
        brandIdx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            field: 'brand_idx',
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        englishName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'english_name'
        },
        startCharacter: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            comment: '첫글자 카테고리',
            field: 'start_character'
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'image_url'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps:true,
    });
};
