import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from './User';

@Table({
    modelName: 'ReviewUser',
    timestamps: true,
    underscored: true,
})
export class ReviewUser extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    reviewIdx: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    userIdx: number;
}
