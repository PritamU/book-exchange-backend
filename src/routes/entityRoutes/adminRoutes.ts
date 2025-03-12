import express from "express";
import {
  adminAuth,
  adminLogin,
  adminLogout,
  createAdmin,
  deleteAdmin,
  editAdmin,
  fetchAdmins,
} from "../../controllers/entityControllers/adminControllers";
import {
  adminAuthCheck,
  readAdminCheck,
  writeAdminCheck,
} from "../../middlewares/auth/adminAuth";
import {
  arrayValidate,
  booleanValidate,
  objectValidate,
  passwordValidate,
  stringValidate,
} from "../../middlewares/validation/fieldValidators";
import {
  basicPaginationHandler,
  validationHandler,
} from "../../middlewares/validation/validationHandler";

let router = express.Router();

// create admin
router.post(
  "",
  [
    stringValidate("body", "name", false),
    stringValidate("body", "username", false),
    passwordValidate("body", "password", false),
    arrayValidate("body", "permissions", false),
    objectValidate("body", "permissions.*", false),
    stringValidate("body", "permissions.*.route", false),
    booleanValidate("body", "permissions.*.read", false),
    booleanValidate("body", "permissions.*.write", false),
  ],
  validationHandler,
  writeAdminCheck,
  createAdmin
);

// admin login
router.post(
  "/login",
  [
    stringValidate("body", "username", false),
    passwordValidate("body", "password", false),
  ],
  validationHandler,
  adminLogin
);

// admin auth
router.get("/auth", adminAuthCheck, adminAuth);

// admin logout
router.post("/logout", adminAuthCheck, adminLogout);

// fetch admins
router.get(
  "",
  [...basicPaginationHandler(), booleanValidate("query", "status", true)],
  validationHandler,
  readAdminCheck,
  fetchAdmins
);

// edit admin
router.patch(
  "",
  [
    stringValidate("body", "adminId", false),
    booleanValidate("body", "status", true),
    arrayValidate("body", "permissions", true),
    objectValidate("body", "permissions.*", false),
    stringValidate("body", "permissions.*.route", false),
    booleanValidate("body", "permissions.*.read", false),
    booleanValidate("body", "permissions.*.write", false),
  ],
  validationHandler,
  writeAdminCheck,
  editAdmin
);

// delete admin
router.delete(
  "",
  [stringValidate("body", "adminId", false)],
  validationHandler,
  writeAdminCheck,
  deleteAdmin
);

export default router;
