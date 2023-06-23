import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { Perfume } from './Perfume';
import { User } from './User';
import { LikeReview } from './LikeReview';
import { Keyword } from './Keyword';
import { JoinReviewKeyword } from './JoinReviewKeyword';
import { ReportReview } from './ReportReview';
import { ReviewUser } from './ReviewUser';

@Table({
    modelName: 'Review',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Review extends Model {
    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        comment: '0.5 ~ 5.0',
    })
    score: null;

    @Column({
        type: DataType.INTEGER,
        comment: '1: 매우 약함, 2: 약함, 3: 보통, 4: 강함, 5: 매우 강함',
    })
    longevity: number;

    @Column({
        type: DataType.INTEGER,
        comment: '1: 가벼움, 2: 보통, 3: 무거움',
    })
    sillage: number;

    @Column({
        type: DataType.INTEGER,
        comment: '1: 봄, 2: 여름, 3: 가을, 4: 겨울',
    })
    seasonal: number;

    @Column({
        type: DataType.INTEGER,
        comment: '1: 남성, 2: 중성, 3: 여성',
    })
    gender: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        comment: '0: false, 1: true',
    })
    access: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    likeCnt: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    perfumeIdx: number;

    @BelongsTo(() => Perfume, {
        foreignKey: {
            name: 'perfumeIdx',
            allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        as: 'Perfume',
    })
    Perfume: Perfume;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userIdx: number;

    @BelongsTo(() => User, {
        foreignKey: {
            name: 'userIdx',
            allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    User: User;

    @BelongsToMany(() => User, {
        through: {
            model: () => ReportReview,
        },
        foreignKey: 'reviewIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    reportReview: User;

    @BelongsToMany(() => User, {
        through: {
            model: () => ReviewUser,
        },
        foreignKey: 'reviewIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    reviewUser: User;

    @HasMany(() => LikeReview, {
        foreignKey: 'reviewIdx',
        as: 'ReviewLike',
        sourceKey: 'id',
    })
    ReviewLike: LikeReview;

    @BelongsToMany(() => Keyword, {
        through: {
            model: () => JoinReviewKeyword,
        },
        foreignKey: 'reviewIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    keywords: Keyword[];
}
