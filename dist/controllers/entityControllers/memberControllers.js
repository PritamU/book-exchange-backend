"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberStatus = exports.telegramWebhook = exports.memberLogout = exports.memberLogin = exports.memberAuth = exports.fetchMembers = exports.fetchMemberLoginCredentials = exports.editMemberInfo = exports.deleteMember = exports.createMember = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const common_1 = require("../../constants/common");
const memberModel_1 = require("../../models/entityModels/memberModel");
const cookieHandler_1 = require("../../utils/cookieHandler");
const paginationUtils_1 = require("../../utils/paginationUtils");
const passwordHandler_1 = require("../../utils/passwordHandler");
const slugHandler_1 = require("../../utils/slugHandler");
// create new member
const createMember = async (req, res, next) => {
    try {
        let { name, password, username } = req.body;
        let slug = (0, slugHandler_1.generateRandomSlug)(name);
        let encryptedPassword = (0, passwordHandler_1.encryptPassword)(password);
        let newMember = memberModel_1.Member.build({
            id: slug,
            name,
            username,
            password: encryptedPassword,
        });
        await newMember.save();
        let returnObject = {
            status: true,
            message: "Member Created!",
        };
        res.json(returnObject);
    }
    catch (e) {
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
    finally {
        return;
    }
};
exports.createMember = createMember;
// login member
const memberLogin = async (req, res, next) => {
    try {
        let { password, username, } = req.body;
        let member = await memberModel_1.Member.findOne({ where: { username: username } });
        if (!member) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Member Not Found!"));
        }
        let { password: encryptedPassword } = member;
        if (!member) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "Your Current Credentials Has been Disabled!"));
        }
        let generatedPassword = (0, passwordHandler_1.decryptPassword)(encryptedPassword);
        if (password !== generatedPassword) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "Incorrect Password!"));
        }
        let payload = {
            name: username,
            id: member.id,
        };
        let jwtToken = (0, cookieHandler_1.generateJwtToken)(payload);
        (0, cookieHandler_1.setCookieHandler)(common_1.MEMBER_COOKIE_NAME, jwtToken, res, "long");
        let returnObject = {
            status: true,
            message: "Login Successful!",
        };
        res.json(returnObject);
    }
    catch (e) {
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
    finally {
        return;
    }
};
exports.memberLogin = memberLogin;
// member auth
const memberAuth = async (req, res, next) => {
    try {
        let { id } = req.user;
        const member = await memberModel_1.Member.findOne({
            where: { id: id },
            raw: true,
            attributes: { exclude: ["password", " createdAt", " updatedAt"] },
        });
        if (!member) {
            throw new Error("Server Error : Member not found!");
        }
        let returnObject = {
            status: true,
            data: member,
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.memberAuth = memberAuth;
// member logout
const memberLogout = async (req, res, next) => {
    try {
        res.clearCookie(common_1.MEMBER_COOKIE_NAME, { domain: process.env.COOKIE_DOMAIN });
        let returnObject = {
            status: true,
            message: "Logged Out!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.memberLogout = memberLogout;
// edit member info
const editMemberInfo = async (req, res, next) => {
    try {
        let { data } = req.body;
        let { id: memberId } = req.user;
        let [affectedCount] = await memberModel_1.Member.update({
            userInformation: data,
        }, { where: { id: memberId } });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured!");
        }
        let returnObject = {
            status: true,
            message: "Member Details Updated!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.editMemberInfo = editMemberInfo;
// update member status
const updateMemberStatus = async (req, res, next) => {
    try {
        let { memberId, status, reasonForRejection } = req.body;
        let [affectedCount] = await memberModel_1.Member.update({
            status,
            reasonForRejection,
        }, { where: { id: memberId } });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured!");
        }
        let returnObject = {
            status: true,
            message: "Member Status Updated!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.updateMemberStatus = updateMemberStatus;
// fetch members
const fetchMembers = async (req, res, next) => {
    try {
        let { page, limit, sortField, sortValue, status, searchKey } = req.query;
        let { page: newPage, limit: newLimit, skip, sortArray, } = (0, paginationUtils_1.paginationSortHandler)(page, limit, sortField, sortValue);
        let filterObject = {
            limit: newLimit,
            offset: skip,
            where: {},
            order: sortArray,
            attributes: { exclude: ["password"] },
        };
        if (status) {
            filterObject.where.status = status;
        }
        if (searchKey) {
            filterObject.where[sequelize_1.Op.or] = [
                {
                    userInformation: {
                        [sequelize_1.Op.contains]: [{ fieldName: "username", value: searchKey }],
                    },
                },
                {
                    userInformation: {
                        [sequelize_1.Op.contains]: [
                            { fieldName: "telegramUsername", value: searchKey },
                        ],
                    },
                },
                {
                    userInformation: {
                        [sequelize_1.Op.contains]: [{ fieldName: "redditUsername", value: searchKey }],
                    },
                },
                {
                    userInformation: {
                        [sequelize_1.Op.contains]: [{ fieldName: "penName", value: searchKey }],
                    },
                },
            ];
        }
        console.log("filterObject", filterObject);
        let count = await memberModel_1.Member.count(filterObject);
        let returnObject = {
            status: true,
            data: {
                count: 0,
                hasNext: false,
                data: [],
            },
        };
        if (count > 0) {
            let members = await memberModel_1.Member.findAll({ ...filterObject });
            let hasNext = (0, paginationUtils_1.getHasNext)(newPage, newLimit, count);
            returnObject = {
                status: true,
                data: { count, hasNext, data: members },
            };
        }
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.fetchMembers = fetchMembers;
// delete member
const deleteMember = async (req, res, next) => {
    try {
        let { memberId } = req.body;
        let affectedCount = await memberModel_1.Member.destroy({ where: { id: memberId } });
        if (affectedCount === 0) {
            throw new Error("Some Error Occured");
        }
        let returnObject = {
            status: true,
            message: "Member Deleted!",
        };
        return res.json(returnObject);
    }
    catch (e) {
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
};
exports.deleteMember = deleteMember;
// fetch member login credentials
const fetchMemberLoginCredentials = async (req, res, next) => {
    try {
        let { memberId } = req.query;
        let data = await memberModel_1.Member.findOne({
            where: { id: memberId },
            raw: true,
            attributes: { include: ["password"] },
        });
        if (!data) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Member Not Found!"));
        }
        let { password: encryptedPassword } = data;
        let password = (0, passwordHandler_1.decryptPassword)(encryptedPassword);
        let returnObject = {
            status: true,
            data: password,
        };
        res.json(returnObject);
    }
    catch (e) {
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
    finally {
        return;
    }
};
exports.fetchMemberLoginCredentials = fetchMemberLoginCredentials;
// telegram webhook
const telegramWebhook = async (req, res, next) => {
    try {
        let { chat } = req.body;
        let member = await memberModel_1.Member.findOne({
            where: { "userInformation.telegramUsername": chat.username },
        });
        if (!member) {
            throw new Error("No Member Found");
        }
        member.telegramChatId = chat.id;
        await member.save();
        let returnObject = {
            status: true,
            message: "success",
        };
        res.json(returnObject);
    }
    catch (e) {
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, e.message));
    }
    finally {
        return;
    }
};
exports.telegramWebhook = telegramWebhook;
