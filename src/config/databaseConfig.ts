import dotenv from "dotenv";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Admin } from "../models/entityModels/adminModel";
import { Member } from "../models/entityModels/memberModel";
import { GeneralInfo } from "../models/metadataModels/generalInfoModel";
import { Exchange } from "../models/metadataModels/monthlyExchangeModel";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT as Dialect,
  host: process.env.DB_HOST,
  models: [Admin, Member, Exchange, GeneralInfo],
});

export { sequelize };
