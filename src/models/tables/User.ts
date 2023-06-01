import {
    Column,
    Model,
    Table,
    DataType,
    Sequelize,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';
import { Review } from './Review';
import { Perfume } from './Perfume';
import { ReportReview } from './ReportReview';
import { LikePerfume } from './LikePerfume';
import { UserReview } from './UserReview';

@Table({
    modelName: 'User',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    userIdx: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nickname: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        comment: '1: 남자, 2: 여자',
    })
    gender: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    birth: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        comment: '0: USER, 1: 게시판 운영자 9: 시스템 관리자',
        defaultValue: 0,
    })
    grade: number;

    @Column({
        type: DataType.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    })
    accessTime: Date;

    @HasMany(() => Review, {
        foreignKey: {
            name: 'userIdx',
            allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    review: Review;

    @BelongsToMany(() => Review, {
        through: {
            model: () => ReportReview,
        },
        foreignKey: 'reporterIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    reportReview: Review;

    @BelongsToMany(() => Perfume, {
        foreignKey: 'perfumeIdx',
        through: {
            model: () => LikePerfume,
        },
        as: 'MyLikePerfumes',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    MyLikePerfumes: Perfume;

    @BelongsToMany(() => Review, {
        through: {
            model: () => UserReview,
        },
        foreignKey: 'userIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    userReview: Review;
}
