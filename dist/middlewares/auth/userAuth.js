"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../../constants/common");
const memberModel_1 = require("../../models/entityModels/memberModel");
// check authentication for user
const userAuthMiddleware = async (req, res, next) => {
    try {
        console.log("here");
        let token = req.cookies[common_1.MEMBER_COOKIE_NAME];
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
        let userId = req.user.id;
        //fetch admin data
        let user = await memberModel_1.Member.count({
            where: { id: userId },
        });
        // return error if admin data not found
        if (user === 0) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "User Credentials Invalid!"));
        }
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
    finally {
        return next();
    }
};
exports.userAuthMiddleware = userAuthMiddleware;
