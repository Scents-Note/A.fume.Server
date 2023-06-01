import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    HasOne,
    Model,
    Table,
} from 'sequelize-typescript';
import { Brand } from './Brand';
import { PerfumeSurvey } from './PerfumeSurvey';
import { Note } from './Note';
import { User } from './User';
import { LikePerfume } from './LikePerfume';
import { Keyword } from './Keyword';
import { JoinPerfumeKeyword } from './JoinPerfumeKeyword';

@Table({
    modelName: 'Perfume',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Perfume extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    perfumeIdx: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    englishName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    imageUrl: string;

    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
    })
    story: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        comment:
            '0: None, 1: 코롱, 2: 오 드 코롱, 3: 오 드 뚜왈렛, 4: 오 드 퍼퓸, 5: 퍼퓸, 6: 기타',
    })
    abundanceRate: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    volumeAndPrice: string;

    @BelongsTo(() => Brand, {
        foreignKey: {
            name: 'brandIdx',
            allowNull: false,
        },
        as: 'Brand',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    Brand: Brand;

    @HasOne(() => PerfumeSurvey, {
        foreignKey: 'perfumeIdx',
        as: 'PerfumeSurvey',
    })
    PerfumeSurvey: PerfumeSurvey;

    @HasMany(() => Note, {
        foreignKey: 'perfumeIdx',
        sourceKey: 'perfumeIdx',
        as: 'Notes',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    Notes: Note;

    @BelongsToMany(() => User, {
        foreignKey: 'userIdx',
        through: {
            model: () => LikePerfume,
        },
        as: 'LikedUsers',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    LikedUsers: User;

    @HasMany(() => LikePerfume, {
        as: 'PerfumeLike',
        sourceKey: 'perfumeIdx',
        foreignKey: 'perfumeIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    PerfumeLike: LikePerfume[];

    @BelongsToMany(() => Keyword, {
        through: {
            model: () => JoinPerfumeKeyword,
        },
        foreignKey: 'perfumeIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    keywords: Keyword[];

    @HasMany(() => JoinPerfumeKeyword, {
        as: 'JoinPerfumeKeywords',
        foreignKey: 'perfumeIdx',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    perfumeKeywords: JoinPerfumeKeyword[];
}
