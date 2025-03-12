import { Column, DataType, Model, Table } from "sequelize-typescript";
import { AdminInterface, Permission } from "../../types/entityTypes/adminTypes";

@Table({ tableName: "admins", timestamps: true })
export class Admin extends Model<Admin, AdminInterface> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  permissions!: Permission[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  status!: boolean;
}
