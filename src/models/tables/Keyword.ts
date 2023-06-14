import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { Review } from './Review';
import { Perfume } from './Perfume';
import { JoinReviewKeyword } from './JoinReviewKeyword';
import { JoinPerfumeKeyword } from './JoinPerfumeKeyword';

@Table({
    modelName: 'Keyword',
    paranoid: true,
    underscored: true,
})
export class Keyword extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    name: string;

    @BelongsToMany(() => Review, {
        through: {
            model: () => JoinReviewKeyword,
        },
        foreignKey: 'keywordIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    reviews: Review[];

    @BelongsToMany(() => Perfume, {
        through: {
            model: () => JoinPerfumeKeyword,
        },
        foreignKey: 'keywordIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    perfumes: Perfume[];
}
