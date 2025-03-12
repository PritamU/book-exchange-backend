"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const memberRoutes_1 = __importDefault(require("./memberRoutes"));
let router = express_1.default.Router();
router.use("/admin", adminRoutes_1.default);
router.use("/member", memberRoutes_1.default);
exports.default = router;
