"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exchangeControllers_1 = require("../../controllers/metadataControllers/exchangeControllers");
const adminAuth_1 = require("../../middlewares/auth/adminAuth");
const userAuth_1 = require("../../middlewares/auth/userAuth");
const fieldValidators_1 = require("../../middlewares/validation/fieldValidators");
const validationHandler_1 = require("../../middlewares/validation/validationHandler");
const exchangeTypes_1 = require("../../types/metadataTypes/exchangeTypes");
let router = express_1.default.Router();
// create exchange by cron
router.post("/cron", exchangeControllers_1.createExchangeByCron);
// create exchange by admin
router.post("", adminAuth_1.writeAdminCheck, exchangeControllers_1.createExchangeByAdmin);
// fetch exchanges by admin
router.get("", [
    ...(0, validationHandler_1.basicPaginationHandler)(),
    (0, fieldValidators_1.enumValidate)("query", "status", true, exchangeTypes_1.exchangeStatusEnum),
    (0, fieldValidators_1.enumValidate)("query", "createdBy", true, ["admin", "cron"]),
    (0, fieldValidators_1.intValidate)("query", "month", true)
        .isInt({ min: 0, max: 11 })
        .withMessage("Month must be between 0 and 11!"),
], validationHandler_1.validationHandler, adminAuth_1.readAdminCheck, exchangeControllers_1.fetchExchangesByAdmin);
// fetch exchange details by admin
router.get("/details/:exchangeId", [(0, fieldValidators_1.stringValidate)("param", "exchangeId", false)], validationHandler_1.validationHandler, adminAuth_1.readAdminCheck, exchangeControllers_1.fetchExchangeDetailsByAdmin);
// fetch exchanges by member
router.get("/fetch-by-member", [
    ...(0, validationHandler_1.basicPaginationHandler)(),
    (0, fieldValidators_1.enumValidate)("query", "status", true, exchangeTypes_1.exchangeStatusEnum),
    (0, fieldValidators_1.intValidate)("query", "month", true)
        .isInt({ min: 0, max: 11 })
        .withMessage("Month must be between 0 and 11!"),
], validationHandler_1.validationHandler, userAuth_1.userAuthMiddleware, exchangeControllers_1.fetchExchangesByMember);
// participate in exchange
router.put("/participate", [(0, fieldValidators_1.stringValidate)("body", "exchangeId", false)], validationHandler_1.validationHandler, userAuth_1.userAuthMiddleware, exchangeControllers_1.participateInExchange);
// cancel participation
router.patch("/cancel-participation", [(0, fieldValidators_1.stringValidate)("body", "exchangeId", false)], validationHandler_1.validationHandler, userAuth_1.userAuthMiddleware, exchangeControllers_1.cancelParticipation);
// assign receivers
router.patch("/assign-receivers", [(0, fieldValidators_1.stringValidate)("body", "exchangeId", false)], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, exchangeControllers_1.assignReceivers);
// cancel exchange
router.patch("/cancel-exchange", [(0, fieldValidators_1.stringValidate)("body", "exchangeId", false)], validationHandler_1.validationHandler, adminAuth_1.writeAdminCheck, exchangeControllers_1.cancelExchange);
exports.default = router;
