"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecretKey = exports.generateMnemonic = exports.generateHash = void 0;
exports.generateOtp = generateOtp;
exports.generateRandomInt = generateRandomInt;
exports.generateRandomNumbers = generateRandomNumbers;
exports.getRandomNumber = getRandomNumber;
const bip39 = require("bip39");
const crypto_1 = __importDefault(require("crypto"));
// function generateRandomString(length: number) {
//   const randomBytes = crypto.randomBytes(length);
//   return crypto
//     .createHash("sha256")
//     .update(randomBytes)
//     .digest("hex")
//     .substring(0, length);
// }
function generateOtp(length) {
    let randomSixDigitCharacter = "";
    let codeLength = length ? length : 6;
    for (let i = 0; i < codeLength; i++) {
        randomSixDigitCharacter += generateRandomNumbers();
    }
    return randomSixDigitCharacter;
}
function generateRandomNumbers() {
    const characters = "0123456789";
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const generateSecretKey = (length) => {
    let fixLength = length ? length : 32;
    return crypto_1.default.randomBytes(fixLength).toString("hex");
};
exports.generateSecretKey = generateSecretKey;
const generateHash = (number) => {
    //generate unique winning number
    const secretKey = generateSecretKey();
    const hash = crypto_1.default
        .createHmac("sha512", secretKey)
        .update(number.toString().toUpperCase())
        .digest("hex");
    return { secretKey, hash };
};
exports.generateHash = generateHash;
const generateMnemonic = () => {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
};
exports.generateMnemonic = generateMnemonic;
function generateRandomInt(min, max, exclude) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
