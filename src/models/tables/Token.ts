import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    modelName: 'Token',
    timestamps: true,
    underscored: true,
})
export class Token extends Model {
    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        primaryKey: true,
    })
    accessToken: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        primaryKey: true,
    })
    refreshToken: string;
}
