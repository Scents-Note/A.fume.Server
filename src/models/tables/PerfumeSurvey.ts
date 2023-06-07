import {
    BelongsTo,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { Perfume } from './Perfume';

@Table({
    modelName: 'PerfumeSurvey',
    timestamps: true,
    underscored: true,
})
export class PerfumeSurvey extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    gender: number;

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
        as: 'Perfume',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    Perfume: Perfume;
}
