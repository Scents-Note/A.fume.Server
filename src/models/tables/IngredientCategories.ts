import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    modelName: 'IngredientCategories',
    timestamps: true,
    underscored: true,
})
export class IngredientCategories extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    usedCountOnPerfume: number;
}
