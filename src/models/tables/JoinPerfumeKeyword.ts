import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Keyword } from './Keyword';
import { Perfume } from './Perfume';

@Table({
    modelName: 'JoinPerfumeKeyword',
    timestamps: true,
    underscored: true,
})
export class JoinPerfumeKeyword extends Model {
    @ForeignKey(() => Perfume)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    perfumeIdx: number;

    @ForeignKey(() => Keyword)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    keywordIdx: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    count: number;

    @BelongsTo(() => Keyword, {
        as: 'Keyword',
        foreignKey: 'keywordIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    keyword: Keyword;
}
