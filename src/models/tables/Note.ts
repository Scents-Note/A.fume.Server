import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Ingredient } from './Ingredient';

@Table({
    paranoid: true,
    timestamps: true,
    underscored: true,
    modelName: 'Note',
})
export class Note extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    perfumeIdx: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    ingredientIdx: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    type: number;

    @HasOne(() => Ingredient, {
        foreignKey: 'ingredientIdx',
        sourceKey: 'ingredientIdx',
        as: 'Ingredients',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    Ingredients: Ingredient;
}
