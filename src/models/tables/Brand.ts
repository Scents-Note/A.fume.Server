import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    timestamps: true,
    underscored: true,
    paranoid: true,
    modelName: 'Brand',
})
export class Brand extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    brandIdx: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    englishName: string;

    @Column({
        type: DataType.CHAR(1),
        allowNull: false,
        comment: '첫글자 카테고리',
    })
    firstInitial: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    imageUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;
}
