"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeAdminCheck = exports.readAdminCheck = exports.adminAuthCheck = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../../constants/common");
const adminModel_1 = require("../../models/entityModels/adminModel");
//check if its admin
const adminCheck = async (req, res, next, accessType) => {
    try {
        let token = req.cookies[common_1.ADMIN_COOKIE_NAME];
        if (!token) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Login Required!"));
        }
        // Verify the token and extract the payload
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid Token!"));
            }
            // Token verification successful, decoded contains the payload
            req.user = decoded;
        });
        let admin = req.user;
        let { id: adminId } = admin || {};
        //fetch admin data
        let adminData = await adminModel_1.Admin.findOne({
            where: { id: adminId },
            attributes: ["permissions", "status"],
            raw: true,
        });
        // return error if admin data not found
        if (!adminData) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Admin Credentials Invalid!"));
        }
        let { status, permissions } = adminData;
        // return error if admin is deleted
        if (!status) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "Your Current Admin Credentials Has been Disabled!"));
        }
        // check if admin has access to this path
        let path = req.originalUrl;
        let isAllowed = permissions === null || permissions === void 0 ? void 0 : permissions.some((permission) => {
            let { route, read, write } = permission;
            if (!path.includes(`/${route}`)) {
                return false;
            }
            if (accessType === "read") {
                return read;
            }
            if (accessType === "write") {
                return write;
            }
        });
        // allow everytime if it's auth path
        if (path.includes("/admin/auth") || path.includes("/admin/logout")) {
            isAllowed = true;
        }
        // return error if admin does not have access
        if (!isAllowed) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "You do not have access to perform this action!"));
        }
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
    finally {
        return next();
    }
};
//check if its admin read request
const readAdminCheck = async (req, res, next) => {
    adminCheck(req, res, next, "read");
};
exports.readAdminCheck = readAdminCheck;
//check if its admin read request
const writeAdminCheck = async (req, res, next) => {
    adminCheck(req, res, next, "write");
};
exports.writeAdminCheck = writeAdminCheck;
//check if its admin read request
const adminAuthCheck = async (req, res, next) => {
    adminCheck(req, res, next, "auth");
};
exports.adminAuthCheck = adminAuthCheck;
