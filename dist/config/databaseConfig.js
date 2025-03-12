"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const adminModel_1 = require("../models/entityModels/adminModel");
const memberModel_1 = require("../models/entityModels/memberModel");
const generalInfoModel_1 = require("../models/metadataModels/generalInfoModel");
const monthlyExchangeModel_1 = require("../models/metadataModels/monthlyExchangeModel");
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    models: [adminModel_1.Admin, memberModel_1.Member, monthlyExchangeModel_1.Exchange, generalInfoModel_1.GeneralInfo],
});
exports.sequelize = sequelize;
