import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    modelName: 'Series',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Series extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    seriesIdx: number;

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
