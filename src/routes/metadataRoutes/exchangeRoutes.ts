import express from "express";

import {
  assignReceivers,
  cancelExchange,
  cancelParticipation,
  createExchangeByAdmin,
  createExchangeByCron,
  fetchExchangeDetailsByAdmin,
  fetchExchangesByAdmin,
  fetchExchangesByMember,
  participateInExchange,
} from "../../controllers/metadataControllers/exchangeControllers";
import {
  readAdminCheck,
  writeAdminCheck,
} from "../../middlewares/auth/adminAuth";
import { userAuthMiddleware } from "../../middlewares/auth/userAuth";
import {
  enumValidate,
  intValidate,
  stringValidate,
} from "../../middlewares/validation/fieldValidators";
import {
  basicPaginationHandler,
  validationHandler,
} from "../../middlewares/validation/validationHandler";
import { exchangeStatusEnum } from "../../types/metadataTypes/exchangeTypes";

let router = express.Router();

// create exchange by cron
router.post("/cron", createExchangeByCron);

// create exchange by admin
router.post("", writeAdminCheck, createExchangeByAdmin);

// fetch exchanges by admin
router.get(
  "",
  [
    ...basicPaginationHandler(),
    enumValidate("query", "status", true, exchangeStatusEnum),
    enumValidate("query", "createdBy", true, ["admin", "cron"]),
    intValidate("query", "month", true)
      .isInt({ min: 0, max: 11 })
      .withMessage("Month must be between 0 and 11!"),
  ],
  validationHandler,
  readAdminCheck,
  fetchExchangesByAdmin
);

// fetch exchange details by admin
router.get(
  "/details/:exchangeId",
  [stringValidate("param", "exchangeId", false)],
  validationHandler,
  readAdminCheck,
  fetchExchangeDetailsByAdmin
);

// fetch exchanges by member
router.get(
  "/fetch-by-member",
  [
    ...basicPaginationHandler(),
    enumValidate("query", "status", true, exchangeStatusEnum),
    intValidate("query", "month", true)
      .isInt({ min: 0, max: 11 })
      .withMessage("Month must be between 0 and 11!"),
  ],
  validationHandler,
  userAuthMiddleware,
  fetchExchangesByMember
);

// participate in exchange
router.put(
  "/participate",
  [stringValidate("body", "exchangeId", false)],
  validationHandler,
  userAuthMiddleware,
  participateInExchange
);

// cancel participation
router.patch(
  "/cancel-participation",
  [stringValidate("body", "exchangeId", false)],
  validationHandler,
  userAuthMiddleware,
  cancelParticipation
);

// assign receivers
router.patch(
  "/assign-receivers",
  [stringValidate("body", "exchangeId", false)],
  validationHandler,
  writeAdminCheck,
  assignReceivers
);

// cancel exchange
router.patch(
  "/cancel-exchange",
  [stringValidate("body", "exchangeId", false)],
  validationHandler,
  writeAdminCheck,
  cancelExchange
);

export default router;
