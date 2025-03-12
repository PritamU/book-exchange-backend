"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.generateRandomSlug = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateSlug = (str) => {
    // Replace spaces with hyphens
    const slug = str
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""); // Remove non-word characters
    return slug;
};
exports.generateSlug = generateSlug;
const generateRandomSlug = (str) => {
    // generate slug
    let slug = generateSlug(str);
    // Generate random characters
    const randomChars = crypto_1.default.randomBytes(3).toString("hex");
    // Append random characters to the slug
    slug += `-${randomChars}`;
    return slug;
};
exports.generateRandomSlug = generateRandomSlug;
