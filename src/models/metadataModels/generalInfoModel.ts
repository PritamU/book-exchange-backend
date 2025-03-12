import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "general_infos", timestamps: true })
export class GeneralInfo extends Model<GeneralInfo> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  data!: any;
}
