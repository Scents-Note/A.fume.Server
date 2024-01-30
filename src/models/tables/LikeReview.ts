import {
    BelongsTo,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { Review } from './Review';
import { User } from './User';

@Table({
    modelName: 'LikeReview',
    timestamps: true,
    underscored: true,
})
export class LikeReview extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    userIdx: number;

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    reviewIdx: number;

    @BelongsTo(() => Review, {
        foreignKey: 'reviewIdx',
        as: 'LikeToReview',
        targetKey: 'id',
    })
    LikeToReview: Review;

    @BelongsTo(() => User, {
        foreignKey: 'userIdx',
        as: 'LikeToUser',
        targetKey: 'userIdx',
    })
    LikeToUser: User;
}
