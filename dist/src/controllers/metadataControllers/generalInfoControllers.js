"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInputFieldsData = exports.fetchGeneralInfo = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const generalInfoModel_1 = require("../../models/metadataModels/generalInfoModel");
// update input fields data
const updateInputFieldsData = async (req, res, next) => {
    let { data } = req.body;
    try {
        let [affectedCount] = await generalInfoModel_1.GeneralInfo.update({ data }, { where: { id: "input_fields" } });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured!");
        }
        let returnObject = {
            status: true,
            message: "Input Fields Updated!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.updateInputFieldsData = updateInputFieldsData;
// fetch general info
const fetchGeneralInfo = async (req, res, next) => {
    let { id } = req.params;
    try {
        let data = await generalInfoModel_1.GeneralInfo.findOne({
            where: { id: id },
            raw: true,
        });
        let a = await generalInfoModel_1.GeneralInfo.findAll();
        console.log("a", a);
        if (!data) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Data Not Found!"));
        }
        let returnObject = {
            status: true,
            data: data.data,
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.fetchGeneralInfo = fetchGeneralInfo;
