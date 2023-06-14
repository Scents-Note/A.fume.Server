import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    modelName: 'ReportUserInquirePerfume',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'report_user_inquire_perfume',
})
export class ReportUserInquirePerfume extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    userIdx: number;

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    perfumeIdx: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    count: number;
}
