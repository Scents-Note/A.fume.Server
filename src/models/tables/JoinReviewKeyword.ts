import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Keyword } from './Keyword';
import { Review } from './Review';

@Table({
    modelName: 'JoinReviewKeyword',
    timestamps: true,
    underscored: true,
})
export class JoinReviewKeyword extends Model {
    @ForeignKey(() => Review)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    reviewIdx: number;

    @ForeignKey(() => Keyword)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    keywordIdx: number;

    @BelongsTo(() => Keyword, {
        foreignKey: 'keywordIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        as: 'Keyword',
    })
    keyword: Keyword;
}
