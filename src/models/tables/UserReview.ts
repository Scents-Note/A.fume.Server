import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from './User';
import { Review } from './Review';

@Table({
    modelName: 'UserReview',
    timestamps: true,
    underscored: true,
})
export class UserReview extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    userIdx: number;

    @ForeignKey(() => Review)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    reviewIdx: number;
}
