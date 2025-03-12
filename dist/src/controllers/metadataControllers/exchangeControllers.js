"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.participateInExchange = exports.fetchExchangesByMember = exports.fetchExchangesByAdmin = exports.fetchExchangeDetailsByAdmin = exports.createExchangeByCron = exports.createExchangeByAdmin = exports.cancelParticipation = exports.cancelExchange = exports.assignReceivers = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const memberModel_1 = require("../../models/entityModels/memberModel");
const monthlyExchangeModel_1 = require("../../models/metadataModels/monthlyExchangeModel");
const paginationUtils_1 = require("../../utils/paginationUtils");
const random_1 = require("../../utils/random");
const telegram_1 = require("../../utils/telegram");
// create exchange by cron
const createExchangeByCron = async (req, res, next) => {
    try {
        // get current month
        let month = (0, dayjs_1.default)().get("month");
        // check if current month exchange exist
        let exchangeExists = await monthlyExchangeModel_1.Exchange.count({
            where: { month: month, [sequelize_1.Op.not]: { status: "cancelled" } },
        });
        if (exchangeExists !== 0) {
            throw new Error("Exchange Already Exists For this month!");
        }
        // create exchange, if not exist
        let newExchange = new monthlyExchangeModel_1.Exchange({
            month,
            members: [],
            status: "initiated",
            createdBy: "cron",
        });
        await newExchange.validate();
        // send telegram messages to every member
        await (0, telegram_1.sendExchangeCreationAlertMessage)();
        await newExchange.save();
        let returnObject = {
            status: true,
            message: "Exchange Created!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.createExchangeByCron = createExchangeByCron;
// create exchange by admin
const createExchangeByAdmin = async (req, res, next) => {
    try {
        // get current month
        let month = (0, dayjs_1.default)().get("month");
        // check if current month exchange exist
        let exchangeExists = await monthlyExchangeModel_1.Exchange.count({
            where: { month: month, [sequelize_1.Op.not]: { status: "cancelled" } },
        });
        if (exchangeExists !== 0) {
            throw new Error("Exchange Already Exists For this month!");
        }
        // create exchange, if not exist
        let newExchange = new monthlyExchangeModel_1.Exchange({
            month,
            members: [],
            status: "initiated",
            createdBy: "admin",
        });
        await newExchange.validate();
        // send telegram messages to every member
        await (0, telegram_1.sendExchangeCreationAlertMessage)();
        await newExchange.save();
        let returnObject = {
            status: true,
            message: "Exchange Created!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.createExchangeByAdmin = createExchangeByAdmin;
// fetch exchanges by admin
const fetchExchangesByAdmin = async (req, res, next) => {
    try {
        let { page, limit, sortField, sortValue, status, createdBy, month } = req.query;
        let { page: newPage, limit: newLimit, skip, sortArray, } = (0, paginationUtils_1.paginationSortHandler)(page, limit, sortField, sortValue);
        let filterObject = {
            limit: newLimit,
            offset: skip,
            where: {},
            order: sortArray,
            raw: true,
            attributes: { exclude: ["members"] },
        };
        if (status) {
            filterObject.where.status = status;
        }
        if (month) {
            filterObject.where.month = month;
        }
        if (createdBy) {
            filterObject.where.createdBy = createdBy;
        }
        let count = await monthlyExchangeModel_1.Exchange.count(filterObject);
        let returnObject = {
            status: true,
            data: {
                count: 0,
                hasNext: false,
                data: [],
            },
        };
        if (count > 0) {
            let exchanges = await monthlyExchangeModel_1.Exchange.findAll({ ...filterObject });
            let hasNext = (0, paginationUtils_1.getHasNext)(newPage, newLimit, count);
            returnObject = {
                status: true,
                data: { count, hasNext, data: exchanges },
            };
        }
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.fetchExchangesByAdmin = fetchExchangesByAdmin;
// fetch exchange details by admin
const fetchExchangeDetailsByAdmin = async (req, res, next) => {
    try {
        let { exchangeId } = req.params;
        // check if current month exchange exist
        let exchange = await monthlyExchangeModel_1.Exchange.findOne({
            where: { id: exchangeId },
            raw: true,
        });
        if (!exchange) {
            throw new Error("Exchange does not exist!");
        }
        let newMembers = [];
        for (let memberItem of exchange.members) {
            let { memberId } = memberItem;
            let memberData = await memberModel_1.Member.findOne({
                where: { id: memberId },
                raw: true,
                attributes: {
                    include: [
                        "userInformation.telegramUsername",
                        "userInformation.redditUsername",
                        "userInformation.penName",
                    ],
                },
            });
            if (!memberData) {
                continue;
            }
            newMembers.push({ ...memberItem, memberInfo: memberData });
        }
        exchange.members = newMembers;
        let returnObject = {
            status: true,
            data: exchange,
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.fetchExchangeDetailsByAdmin = fetchExchangeDetailsByAdmin;
// fetch exchanges by member
const fetchExchangesByMember = async (req, res, next) => {
    try {
        let { page, limit, sortField, sortValue, status, month } = req.query;
        let { id: memberId } = req.user;
        let { page: newPage, limit: newLimit, skip, sortArray, } = (0, paginationUtils_1.paginationSortHandler)(page, limit, sortField, sortValue);
        let filterObject = {
            limit: newLimit,
            offset: skip,
            where: {},
            order: sortArray,
            raw: true,
        };
        if (status) {
            filterObject.where.status = status;
        }
        if (month) {
            filterObject.where.month = month;
        }
        let count = await monthlyExchangeModel_1.Exchange.count(filterObject);
        let returnObject = {
            status: true,
            data: {
                count: 0,
                hasNext: false,
                data: [],
            },
        };
        if (count > 0) {
            let exchanges = await monthlyExchangeModel_1.Exchange.findAll({
                ...filterObject,
            });
            let hasNext = (0, paginationUtils_1.getHasNext)(newPage, newLimit, count);
            exchanges = exchanges.map((exchangeItem) => {
                let { members } = exchangeItem;
                members = members.filter((memberItem) => {
                    memberItem.memberId === memberId;
                });
                return { ...exchangeItem, members };
            });
            returnObject = {
                status: true,
                data: { count, hasNext, data: exchanges },
            };
        }
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.fetchExchangesByMember = fetchExchangesByMember;
// participate In exchange
const participateInExchange = async (req, res, next) => {
    try {
        let { exchangeId } = req.body;
        let { id: memberId } = req.user;
        // check if current month exchange exist
        let exchange = await monthlyExchangeModel_1.Exchange.findOne({
            where: { id: exchangeId },
        });
        if (!exchange) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Exchange Not Found!"));
        }
        let { status, members } = exchange;
        if (status !== "initiated") {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, `${status} exchanges cannot be joined!`));
        }
        let memberAlreadyExists = members.findIndex((item) => item.memberId === memberId);
        if (memberAlreadyExists !== -1) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "You have already participated in this event!"));
        }
        exchange.memberCount += 1;
        exchange.members.push({
            memberId,
            orderCreated: false,
        });
        await exchange.save();
        let returnObject = {
            status: true,
            message: "Participation Successfull!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.participateInExchange = participateInExchange;
// cancel participation
const cancelParticipation = async (req, res, next) => {
    try {
        let { exchangeId } = req.body;
        let { id: memberId } = req.user;
        // check if current month exchange exist
        let exchange = await monthlyExchangeModel_1.Exchange.findOne({
            where: { id: exchangeId },
        });
        if (!exchange) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Exchange Not Found!"));
        }
        let { status, members } = exchange;
        if (status !== "initiated") {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, `${status} exchange participation cannot be cancelled!`));
        }
        let memberExists = members.findIndex((item) => item.memberId === memberId);
        if (memberExists === -1) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "You have not participated in this event!"));
        }
        exchange.memberCount -= 1;
        exchange.members = members.filter((_, index) => index !== memberExists);
        await exchange.save();
        let returnObject = {
            status: true,
            message: "Participation Cancelled!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.cancelParticipation = cancelParticipation;
// assign receivers
const assignReceivers = async (req, res, next) => {
    try {
        let { exchangeId } = req.body;
        // check if current month exchange exist
        let exchange = await monthlyExchangeModel_1.Exchange.findOne({
            where: { id: exchangeId },
        });
        if (!exchange) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Exchange Not Found!"));
        }
        let { status, members, memberCount } = exchange;
        if (status !== "initiated") {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, `Only initiated exchanges can be assigned receivers!`));
        }
        let memberIndexArray = [];
        for (let i = 0; i < memberCount; i++) {
            memberIndexArray.push(i);
        }
        let assignedIndexes = [];
        let newMembers = [];
        let memberIndex = 0;
        for (let memberItem of members) {
            let availableIndexes = [];
            for (let i = 0; i < memberCount; i++) {
                if (i === memberIndex) {
                    continue;
                }
                if (assignedIndexes.includes(i)) {
                    continue;
                }
                availableIndexes.push(i);
            }
            let selectedIndex = availableIndexes[(0, random_1.getRandomNumber)(0, availableIndexes.length - 1)];
            assignedIndexes.push(selectedIndex);
            newMembers.push({
                ...memberItem,
                assignedMemberId: members[selectedIndex].memberId,
            });
            memberIndex += 1;
            let receiverData = await memberModel_1.Member.findOne({
                where: { id: members[selectedIndex].memberId },
                raw: true,
                attributes: { include: ["userInformation telegramChatId"] },
            });
            if (!receiverData) {
                throw new Error("Server Error: Receiver Data Not Found!");
            }
            await (0, telegram_1.sendReceiverDetails)({
                chatId: receiverData.telegramChatId,
                userInformation: receiverData.userInformation,
            });
        }
        exchange.status = "in-progress";
        exchange.members = newMembers;
        await exchange.save();
        let returnObject = {
            status: true,
            message: "Receivers Assigned!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.assignReceivers = assignReceivers;
// cancel Exchange
const cancelExchange = async (req, res, next) => {
    try {
        let { exchangeId } = req.body;
        // check if current month exchange exist
        let [affectedCount] = await monthlyExchangeModel_1.Exchange.update({
            status: "cancelled",
        }, {
            where: { id: exchangeId },
        });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured!");
        }
        await (0, telegram_1.sendExchangeCancellationAlertMessage)(exchangeId);
        let returnObject = {
            status: true,
            message: "Exchange Cancelled!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.cancelExchange = cancelExchange;
