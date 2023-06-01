import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { IngredientCategories } from './IngredientCategories';
import { Series } from './Series';
import { Note } from './Note';

@Table({
    modelName: 'Ingredient',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Ingredient extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
    })
    ingredientIdx: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    englishName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    imageUrl: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    categoryIdx: number;

    @BelongsTo(() => Series, {
        foreignKey: 'seriesIdx',
        as: 'Series',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    Series: Series;

    @BelongsTo(() => IngredientCategories, {
        foreignKey: 'categoryIdx',
        as: 'IngredientCategories',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    })
    IngredientCategories: IngredientCategories;

    @HasMany(() => Note, {
        foreignKey: 'ingredientIdx',
        sourceKey: 'ingredientIdx',
        as: 'Notes',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    Notes: Note;
}
