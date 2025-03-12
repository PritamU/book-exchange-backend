"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = exports.setCookieHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../constants/common");
const setCookieHandler = (name, value, res, duration) => {
    let isDev = process.env.APP_ENV === "dev" ? true : false;
    let expiryTime = common_1.LOGIN_COOKIE_LONG_SESSION_DURATION * 24 * 60 * 60 * 1000;
    if (duration === "short") {
        expiryTime = common_1.LOGIN_COOKIE_SHORT_SESSION_DURATION * 60 * 60 * 1000;
    }
    const secureCookieOptions = {
        maxAge: expiryTime,
        domain: isDev ? "localhost" : process.env.CORS_DOMAIN,
        sameSite: isDev ? false : "none",
        secure: isDev ? false : true,
        httpOnly: isDev ? false : true,
    };
    res.cookie(name, value, secureCookieOptions);
};
exports.setCookieHandler = setCookieHandler;
const generateJwtToken = (payload) => {
    const JWT_TOKEN_SECRET = process.env.JWT_SECRET; // telling ts that value of this string will never be null to avoid error.
    const iat = Math.floor(Date.now() / 1000);
    payload.exp = iat + 2630000;
    const token = jsonwebtoken_1.default.sign(payload, JWT_TOKEN_SECRET);
    return token;
};
exports.generateJwtToken = generateJwtToken;
