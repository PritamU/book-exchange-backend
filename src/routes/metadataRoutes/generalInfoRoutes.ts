import express from "express";
import {
  fetchGeneralInfo,
  updateInputFieldsData,
} from "../../controllers/metadataControllers/generalInfoControllers";
import { writeAdminCheck } from "../../middlewares/auth/adminAuth";
import {
  arrayValidate,
  enumValidate,
  intValidate,
  objectValidate,
  stringValidate,
} from "../../middlewares/validation/fieldValidators";
import { validationHandler } from "../../middlewares/validation/validationHandler";

let router = express.Router();

// update input fields
router.post(
  "/input-fields",
  [
    arrayValidate("body", "data", false)
      .isArray({ min: 1 })
      .withMessage("Atleast One Field Required!"),
    objectValidate("body", "data.*", false),
    stringValidate("body", "data.*.fieldId", false),
    stringValidate("body", "data.*.fieldName", false),
    stringValidate("body", "data.*.fieldDescription", true),
    enumValidate("body", "data.*.fieldType", false, [
      "string",
      "number",
      "select",
      "radio",
    ]),
    arrayValidate("body", "data.*.possibleValues", true),
    intValidate("body", "data.*.min", true),
    intValidate("body", "data.*.max", true),
  ],
  validationHandler,
  writeAdminCheck,
  updateInputFieldsData
);

// fetch general info
router.get(
  "/:id",
  [stringValidate("param", "id", false)],
  validationHandler,
  fetchGeneralInfo
);

export default router;
