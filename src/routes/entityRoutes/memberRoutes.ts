import express from "express";
import { body } from "express-validator";
import {
  createMember,
  deleteMember,
  editMemberInfo,
  fetchMemberLoginCredentials,
  fetchMembers,
  memberAuth,
  memberLogin,
  memberLogout,
  telegramWebhook,
  updateMemberStatus,
} from "../../controllers/entityControllers/memberControllers";
import {
  readAdminCheck,
  writeAdminCheck,
} from "../../middlewares/auth/adminAuth";
import { userAuthMiddleware } from "../../middlewares/auth/userAuth";
import {
  arrayValidate,
  enumValidate,
  intValidate,
  objectValidate,
  passwordValidate,
  stringValidate,
} from "../../middlewares/validation/fieldValidators";
import {
  basicPaginationHandler,
  validationHandler,
} from "../../middlewares/validation/validationHandler";
import { memberStatusEnum } from "../../types/entityTypes/memberTypes";

let router = express.Router();

// create member
router.post(
  "",
  [
    stringValidate("body", "name", false),
    stringValidate("body", "username", false),
    passwordValidate("body", "password", false),
  ],
  validationHandler,
  writeAdminCheck,
  createMember
);

// member login
router.post(
  "/login",
  [
    stringValidate("body", "username", false),
    passwordValidate("body", "password", false),
  ],
  validationHandler,
  memberLogin
);

// member auth
router.get("/auth", userAuthMiddleware, memberAuth);

// member logout
router.post("/logout", userAuthMiddleware, memberLogout);

// edit member info
router.patch(
  "",
  [
    arrayValidate("body", "data", false)
      .isArray({ min: 1 })
      .withMessage("Atleast One Field Required!"),
    objectValidate("body", "data.*", false),
    stringValidate("body", "data.*.fieldId", false),
    stringValidate("body", "data.*.fieldName", false),
    stringValidate("body", "data.*.fieldDescription", true),
    stringValidate("body", "data.*.value", false),
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
  userAuthMiddleware,
  editMemberInfo
);

// update member status
router.patch(
  "/status",
  [
    stringValidate("body", "memberId", false),
    enumValidate("body", "status", false, ["approved", "rejected"]),
    stringValidate("body", "reasonForRejection", true),
    body("reasonForRejection")
      .if(body("status").equals("rejected"))
      .notEmpty()
      .withMessage("Reason For Rejection Required!"),
  ],
  validationHandler,
  writeAdminCheck,
  updateMemberStatus
);

// fetch members
router.get(
  "",
  [
    ...basicPaginationHandler(),
    enumValidate("query", "status", true, memberStatusEnum),
    stringValidate("query", "searchKey", true),
  ],
  validationHandler,
  readAdminCheck,
  fetchMembers
);

// delete member
router.delete(
  "",
  [stringValidate("body", "memberId", false)],
  validationHandler,
  writeAdminCheck,
  deleteMember
);

// delete member
router.get(
  "/credential",
  [stringValidate("query", "memberId", false)],
  validationHandler,
  readAdminCheck,
  fetchMemberLoginCredentials
);

// telegram webhook
router.post("/telgram-webhook", telegramWebhook);

export default router;
