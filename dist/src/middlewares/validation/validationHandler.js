"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = exports.convertStringToArrayOfStrings = exports.convertStringifiedArrayToJsonArray = exports.contentValidationHandler = exports.contentPaginationHandler = exports.basicPaginationHandler = exports.arrayOfStringsPaginationHandler = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const commonTypes_1 = require("../../types/commonTypes");
const fieldValidators_1 = require("./fieldValidators");
const validationHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        console.log("errorMessage", errorMessage);
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, errorMessage));
    }
    next();
};
exports.validationHandler = validationHandler;
const basicPaginationHandler = () => {
    return [
        (0, fieldValidators_1.intValidate)("query", "page", true),
        (0, fieldValidators_1.intValidate)("query", "limit", true),
        (0, fieldValidators_1.stringValidate)("query", "sortField", true),
        (0, fieldValidators_1.enumValidate)("query", "sortValue", true, commonTypes_1.sortValueEnum).toInt(),
    ];
};
exports.basicPaginationHandler = basicPaginationHandler;
const contentValidationHandler = (fieldName) => {
    return [
        (0, fieldValidators_1.arrayValidate)("body", fieldName, true),
        (0, fieldValidators_1.objectValidate)("body", `${fieldName}.*`, true),
        (0, fieldValidators_1.stringValidate)("body", `${fieldName}.*.title`, false),
        (0, fieldValidators_1.stringValidate)("body", `${fieldName}.*.content`, true),
    ];
};
exports.contentValidationHandler = contentValidationHandler;
const arrayOfStringsPaginationHandler = (field) => {
    var _a;
    return ((_a = (0, fieldValidators_1.arrayValidate)("body", field, false)) === null || _a === void 0 ? void 0 : _a.isArray().withMessage(`${field} is empty!`),
        (0, fieldValidators_1.stringValidate)("query", `${field}.*`, false));
};
exports.arrayOfStringsPaginationHandler = arrayOfStringsPaginationHandler;
const contentPaginationHandler = (field) => {
    var _a;
    return ((_a = (0, fieldValidators_1.arrayValidate)("body", field, false)) === null || _a === void 0 ? void 0 : _a.isArray().withMessage(`${field} is empty!`),
        (0, fieldValidators_1.objectValidate)("query", `${field}.*`, false),
        (0, fieldValidators_1.stringValidate)("query", `${field}.*.title`, false),
        (0, fieldValidators_1.stringValidate)("query", `${field}.*.content`, true));
};
exports.contentPaginationHandler = contentPaginationHandler;
const convertStringToArrayOfStrings = (value) => {
    return value === null || value === void 0 ? void 0 : value.split(",");
};
exports.convertStringToArrayOfStrings = convertStringToArrayOfStrings;
const convertStringifiedArrayToJsonArray = (value) => {
    if (value) {
        return JSON.parse(value);
    }
};
exports.convertStringifiedArrayToJsonArray = convertStringifiedArrayToJsonArray;
