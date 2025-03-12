"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generalInfoControllers_1 = require("../../controllers/metadataControllers/generalInfoControllers");
const adminAuth_1 = require("../../middlewares/auth/adminAuth");
const fieldValidators_1 = require("../../middlewares/validation/fieldValidators");
const validationHandler_1 = require("../../middlewares/validation/validationHandler");
let router = express_1.default.Router();
// update input fields
router.post("/input-fields", [
    (0, fieldValidators_1.arrayValidate)("body", "data", false)
        .isArray({ min: 1 })
        .withMessage("Atleast One Field Required!"),
    (0, fieldValidators_1.objectValidate)("body", "data.*", false),
    (0, fieldValidators_1.stringValidate)("body", "data.*.fieldId", false),
    (0, fieldValidators_1.stringValidate)("body", "data.*.fieldName", false),
    (0, fieldValidators_1.stringValidate)("body", "data.*.fieldDescription", true),
    (0, fieldValidators_1.enumValidate)("body", "data.*.fieldType", false, [
        "string",
        "number",
        "select",
        "radio",
    ]),
    (0, fieldValidators_1.arrayValidate)("body", "data.*.possibleValues", true),
    (0, fieldValidators_1.intValidate)("body", "data.*.min", true),
    (0, fieldValidators_1.intValidate)("body", "data.*.max", true),
], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, generalInfoControllers_1.updateInputFieldsData);
// fetch general info
router.get("/:id", [(0, fieldValidators_1.stringValidate)("param", "id", false)], validationHandler_1.validationHandler, generalInfoControllers_1.fetchGeneralInfo);
exports.default = router;
