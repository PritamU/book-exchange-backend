"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../../controllers/entityControllers/adminControllers");
const adminAuth_1 = require("../../middlewares/auth/adminAuth");
const fieldValidators_1 = require("../../middlewares/validation/fieldValidators");
const validationHandler_1 = require("../../middlewares/validation/validationHandler");
let router = express_1.default.Router();
// create admin
router.post("", [
    (0, fieldValidators_1.stringValidate)("body", "name", false),
    (0, fieldValidators_1.stringValidate)("body", "username", false),
    (0, fieldValidators_1.passwordValidate)("body", "password", false),
    (0, fieldValidators_1.arrayValidate)("body", "permissions", false),
    (0, fieldValidators_1.objectValidate)("body", "permissions.*", false),
    (0, fieldValidators_1.stringValidate)("body", "permissions.*.route", false),
    (0, fieldValidators_1.booleanValidate)("body", "permissions.*.read", false),
    (0, fieldValidators_1.booleanValidate)("body", "permissions.*.write", false),
], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, adminControllers_1.createAdmin);
// admin login
router.post("/login", [
    (0, fieldValidators_1.stringValidate)("body", "username", false),
    (0, fieldValidators_1.passwordValidate)("body", "password", false),
], validationHandler_1.validationHandler, adminControllers_1.adminLogin);
// admin auth
router.get("/auth", adminAuth_1.adminAuthCheck, adminControllers_1.adminAuth);
// admin logout
router.post("/logout", adminAuth_1.adminAuthCheck, adminControllers_1.adminLogout);
// fetch admins
router.get("", [...(0, validationHandler_1.basicPaginationHandler)(), (0, fieldValidators_1.booleanValidate)("query", "status", true)], validationHandler_1.validationHandler, adminAuth_1.readAdminCheck, adminControllers_1.fetchAdmins);
// edit admin
router.patch("", [
    (0, fieldValidators_1.stringValidate)("body", "adminId", false),
    (0, fieldValidators_1.booleanValidate)("body", "status", true),
    (0, fieldValidators_1.arrayValidate)("body", "permissions", true),
    (0, fieldValidators_1.objectValidate)("body", "permissions.*", false),
    (0, fieldValidators_1.stringValidate)("body", "permissions.*.route", false),
    (0, fieldValidators_1.booleanValidate)("body", "permissions.*.read", false),
    (0, fieldValidators_1.booleanValidate)("body", "permissions.*.write", false),
], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, adminControllers_1.editAdmin);
// delete admin
router.delete("", [(0, fieldValidators_1.stringValidate)("body", "adminId", false)], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, adminControllers_1.deleteAdmin);
exports.default = router;
