"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const memberControllers_1 = require("../../controllers/entityControllers/memberControllers");
const adminAuth_1 = require("../../middlewares/auth/adminAuth");
const userAuth_1 = require("../../middlewares/auth/userAuth");
const fieldValidators_1 = require("../../middlewares/validation/fieldValidators");
const validationHandler_1 = require("../../middlewares/validation/validationHandler");
const memberTypes_1 = require("../../types/entityTypes/memberTypes");
let router = express_1.default.Router();
// create member
router.post("", [
    (0, fieldValidators_1.stringValidate)("body", "name", false),
    (0, fieldValidators_1.stringValidate)("body", "username", false),
    (0, fieldValidators_1.passwordValidate)("body", "password", false),
], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, memberControllers_1.createMember);
// member login
router.post("/login", [
    (0, fieldValidators_1.stringValidate)("body", "username", false),
    (0, fieldValidators_1.passwordValidate)("body", "password", false),
], validationHandler_1.validationHandler, memberControllers_1.memberLogin);
// member auth
router.get("/auth", userAuth_1.userAuthMiddleware, memberControllers_1.memberAuth);
// member logout
router.post("/logout", userAuth_1.userAuthMiddleware, memberControllers_1.memberLogout);
// edit member info
router.patch("", [
    (0, fieldValidators_1.arrayValidate)("body", "data", false)
        .isArray({ min: 1 })
        .withMessage("Atleast One Field Required!"),
    (0, fieldValidators_1.objectValidate)("body", "data.*", false),
    (0, fieldValidators_1.stringValidate)("body", "data.*.fieldId", false),
    (0, fieldValidators_1.stringValidate)("body", "data.*.fieldName", false),
    (0, fieldValidators_1.stringValidate)("body", "data.*.fieldDescription", true),
    (0, fieldValidators_1.stringValidate)("body", "data.*.value", false),
    (0, fieldValidators_1.enumValidate)("body", "data.*.fieldType", false, [
        "string",
        "number",
        "select",
        "radio",
    ]),
    (0, fieldValidators_1.arrayValidate)("body", "data.*.possibleValues", true),
    (0, fieldValidators_1.intValidate)("body", "data.*.min", true),
    (0, fieldValidators_1.intValidate)("body", "data.*.max", true),
], validationHandler_1.validationHandler, userAuth_1.userAuthMiddleware, memberControllers_1.editMemberInfo);
// update member status
router.patch("/status", [
    (0, fieldValidators_1.stringValidate)("body", "memberId", false),
    (0, fieldValidators_1.enumValidate)("body", "status", false, ["approved", "rejected"]),
    (0, fieldValidators_1.stringValidate)("body", "reasonForRejection", true),
    (0, express_validator_1.body)("reasonForRejection")
        .if((0, express_validator_1.body)("status").equals("rejected"))
        .notEmpty()
        .withMessage("Reason For Rejection Required!"),
], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, memberControllers_1.updateMemberStatus);
// fetch members
router.get("", [
    ...(0, validationHandler_1.basicPaginationHandler)(),
    (0, fieldValidators_1.enumValidate)("query", "status", true, memberTypes_1.memberStatusEnum),
    (0, fieldValidators_1.stringValidate)("query", "searchKey", true),
], validationHandler_1.validationHandler, adminAuth_1.readAdminCheck, memberControllers_1.fetchMembers);
// delete member
router.delete("", [(0, fieldValidators_1.stringValidate)("body", "memberId", false)], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, memberControllers_1.deleteMember);
// delete member
router.get("/credential", [(0, fieldValidators_1.stringValidate)("query", "memberId", false)], validationHandler_1.validationHandler, adminAuth_1.readAdminCheck, memberControllers_1.fetchMemberLoginCredentials);
// telegram webhook
router.post("/telgram-webhook", memberControllers_1.telegramWebhook);
exports.default = router;
