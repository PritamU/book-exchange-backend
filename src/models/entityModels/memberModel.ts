import { Column, DataType, Model, Table } from "sequelize-typescript";
import {
  MemberInfoFieldInterface,
  MemberStatusTypes,
} from "../../types/entityTypes/memberTypes";

@Table({ tableName: "members", timestamps: true })
export class Member extends Model<Member> {
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
    type: DataType.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  })
  status!: MemberStatusTypes;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  userInformation!: MemberInfoFieldInterface[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  telegramChatId: string;

  // @Column({
  //   type: DataType.STRING,
  //   unique: true,
  //   allowNull: true,
  // })
  // redditUsername: string;

  // @Column({
  //   type: DataType.STRING,
  //   unique: true,
  //   allowNull: true,
  // })
  // telegramUsername: string;

  // @Column({
  //   type: DataType.STRING,
  //   unique: true,
  //   allowNull: true,
  // })
  // penName: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // topBooks: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // currentGenres: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // interestedGenres: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // tbr: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // authorsToAvoid: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // preferredLanguages: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // ageRange: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // postalAddress: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reasonForRejection: string;
}
