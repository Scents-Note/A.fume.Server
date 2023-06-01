import {
    BelongsTo,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { Perfume } from './Perfume';

@Table({
    modelName: 'InquireHistory',
    timestamps: true,
    underscored: true,
})
export class InquireHistory extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userIdx: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    perfumeIdx: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    routes: string;

    @BelongsTo(() => Perfume, {
        as: 'Perfume',
        foreignKey: 'perfumeIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    Perfume: Perfume;
}
