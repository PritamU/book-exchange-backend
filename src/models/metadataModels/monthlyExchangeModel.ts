import { Column, DataType, Model, Table } from "sequelize-typescript";
import {
  ExchangeInterface,
  ExchangeStatusTypes,
  MembersInExchangeInterface,
} from "../../types/metadataTypes/exchangeTypes";

@Table({ tableName: "exchanges", timestamps: true })
export class Exchange extends Model<Exchange, ExchangeInterface> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    },
  })
  month!: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  members!: MembersInExchangeInterface[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  memberCount!: number;

  @Column({
    type: DataType.ENUM("initiated", "in-progress", "completed", "cancelled"),
    allowNull: false,
    defaultValue: "in-progress",
  })
  status!: ExchangeStatusTypes;

  @Column({
    type: DataType.ENUM("admin", "cron"),
    allowNull: false,
    defaultValue: "admin",
  })
  createdBy!: "admin" | "cron";
}
