import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from './User';
import { Perfume } from './Perfume';

@Table({
    modelName: 'LikePerfume',
    timestamps: true,
    underscored: true,
})
export class LikePerfume extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    userIdx: number;

    @ForeignKey(() => Perfume)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    perfumeIdx: number;
}
