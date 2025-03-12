"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAdmins = exports.editAdmin = exports.deleteAdmin = exports.createAdmin = exports.adminLogout = exports.adminLogin = exports.adminAuth = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const common_1 = require("../../constants/common");
const adminModel_1 = require("../../models/entityModels/adminModel");
const cookieHandler_1 = require("../../utils/cookieHandler");
const paginationUtils_1 = require("../../utils/paginationUtils");
const passwordHandler_1 = require("../../utils/passwordHandler");
const slugHandler_1 = require("../../utils/slugHandler");
// create new admin
const createAdmin = async (req, res, next) => {
    try {
        let { name, password, permissions, username } = req.body;
        let slug = (0, slugHandler_1.generateRandomSlug)(name);
        let hashedPassword = await (0, passwordHandler_1.hashPassword)(password);
        let newAdmin = adminModel_1.Admin.build({
            id: slug,
            name,
            username,
            password: hashedPassword,
            permissions,
        });
        await newAdmin.save();
        let returnObject = {
            status: true,
            message: "Admin Created!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.createAdmin = createAdmin;
// login admin
const adminLogin = async (req, res, next) => {
    try {
        let { password, username, } = req.body;
        let admin = await adminModel_1.Admin.findOne({ where: { username: username } });
        if (!admin) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Admin Not Found!"));
        }
        let { password: hashedPassword, status } = admin;
        if (!admin) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "Your Current Admin Credentials Has been Disabled!"));
        }
        let isPasswordCorrect = await (0, passwordHandler_1.comparePassword)(password, hashedPassword);
        if (!isPasswordCorrect) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "Incorrect Password!"));
        }
        let payload = {
            name: username,
            id: admin.id,
        };
        let jwtToken = (0, cookieHandler_1.generateJwtToken)(payload);
        (0, cookieHandler_1.setCookieHandler)(common_1.ADMIN_COOKIE_NAME, jwtToken, res, "long");
        let returnObject = {
            status: true,
            message: "Login Successful!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.adminLogin = adminLogin;
// admin auth
const adminAuth = async (req, res, next) => {
    try {
        let payload = req.user;
        let returnObject = {
            status: true,
            data: payload,
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.adminAuth = adminAuth;
// admin logout
const adminLogout = async (req, res, next) => {
    try {
        res.clearCookie(common_1.ADMIN_COOKIE_NAME, { domain: process.env.COOKIE_DOMAIN });
        let returnObject = {
            status: true,
            message: "Admin Logged Out!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.adminLogout = adminLogout;
// fetch admins
const fetchAdmins = async (req, res, next) => {
    try {
        let { page, limit, sortField, sortValue, status } = req.query;
        let { page: newPage, limit: newLimit, skip, sortArray, } = (0, paginationUtils_1.paginationSortHandler)(page, limit, sortField, sortValue);
        let filterObject = {
            limit: newLimit,
            offset: skip,
            where: {},
            order: sortArray,
            attributes: { exclude: ["password"] },
        };
        if (status !== undefined) {
            filterObject.where.status = status;
        }
        let count = await adminModel_1.Admin.count(filterObject);
        let returnObject = {
            status: true,
            data: {
                count: 0,
                hasNext: false,
                data: [],
            },
        };
        if (count > 0) {
            let admins = await adminModel_1.Admin.findAll({ ...filterObject });
            let hasNext = (0, paginationUtils_1.getHasNext)(newPage, newLimit, count);
            returnObject = {
                status: true,
                data: { count, hasNext, data: admins },
            };
        }
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.fetchAdmins = fetchAdmins;
// edit Admin
const editAdmin = async (req, res, next) => {
    try {
        let { adminId, permissions, status } = req.body;
        let [affectedCount] = await adminModel_1.Admin.update({
            permissions,
            status,
        }, { where: { id: adminId } });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured");
        }
        let returnObject = {
            status: true,
            message: "Admin Updated!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.editAdmin = editAdmin;
// delete admin
const deleteAdmin = async (req, res, next) => {
    try {
        let { adminId } = req.body;
        let affectedCount = await adminModel_1.Admin.destroy({ where: { id: adminId } });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured");
        }
        let returnObject = {
            status: true,
            message: "Admin Deleted!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.deleteAdmin = deleteAdmin;
