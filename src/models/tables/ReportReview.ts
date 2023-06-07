import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from './User';
import { Review } from './Review';

@Table({
    modelName: 'ReportReview',
    timestamps: true,
    underscored: true,
})
export class ReportReview extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    reporterIdx: number;

    @ForeignKey(() => Review)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    reviewIdx: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    reason: string;
}
