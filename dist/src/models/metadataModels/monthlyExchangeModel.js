"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exchange = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Exchange = class Exchange extends sequelize_typescript_1.Model {
};
exports.Exchange = Exchange;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Exchange.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12,
        },
    }),
    __metadata("design:type", Number)
], Exchange.prototype, "month", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], Exchange.prototype, "members", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Exchange.prototype, "memberCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("in-progress", "completed"),
        allowNull: false,
        defaultValue: "in-progress",
    }),
    __metadata("design:type", String)
], Exchange.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("admin", "cron"),
        allowNull: false,
        defaultValue: "admin",
    }),
    __metadata("design:type", String)
], Exchange.prototype, "createdBy", void 0);
exports.Exchange = Exchange = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "exchanges", timestamps: true })
], Exchange);
