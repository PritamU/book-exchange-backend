"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptEmail = exports.comparePassword = exports.hashPassword = exports.decryptPassword = exports.encryptPassword = void 0;
const cryptr_1 = __importDefault(require("cryptr"));
// const secretKey = process.env.CRYPTR_SECRET_KEY;
// const cryptr = new Cryptr(`${secretKey}`);
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryptPassword = (password) => {
    const secretKey = process.env.CRYPTR_SECRET_KEY;
    const cryptr = new cryptr_1.default(`${secretKey}`);
    const encryptedPassword = cryptr.encrypt(password);
    return encryptedPassword;
};
exports.encryptPassword = encryptPassword;
const decryptPassword = (encryptedPassword) => {
    const secretKey = process.env.CRYPTR_SECRET_KEY;
    const cryptr = new cryptr_1.default(`${secretKey}`);
    const decryptedPassword = cryptr.decrypt(encryptedPassword);
    return decryptedPassword;
};
exports.decryptPassword = decryptPassword;
// Function to hash a password using bcrypt
const hashPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds to use
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
// Function to compare a password with its hash using bcrypt
const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
};
exports.comparePassword = comparePassword;
const encryptEmail = (email) => {
    const splitData = email.split("@");
    let name = splitData[0];
    let maskedName = name.slice(0, -2);
    let encryptedName = maskedName + "**";
    return `${encryptedName}@${splitData[1]}`;
};
exports.encryptEmail = encryptEmail;
