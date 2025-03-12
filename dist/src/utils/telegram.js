"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReceiverDetails = exports.sendExchangeCreationAlertMessage = exports.sendExchangeCancellationAlertMessage = void 0;
const sendExchangeCreationAlertMessage = async () => {
    const res = await fetch(`https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_GROUP,
            text: `Attention\n\nA new Exchange Has Been Initiated For this month. Please visit ${process.env.CLIENT_URL} to participate in the exchange!`,
            parse_mode: "html",
        }),
    });
    const resData = await res.json();
    console.log("resData", resData);
    if (!resData.ok) {
        throw new Error(resData.description);
    }
};
exports.sendExchangeCreationAlertMessage = sendExchangeCreationAlertMessage;
const sendExchangeCancellationAlertMessage = async (exchangeId) => {
    const res = await fetch(`https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_GROUP,
            text: `Attention\n\nAn exchange with ID ${exchangeId} has been Cancelled.!`,
            parse_mode: "html",
        }),
    });
    const resData = await res.json();
    console.log("resData", resData);
    if (!resData.ok) {
        throw new Error(resData.description);
    }
};
exports.sendExchangeCancellationAlertMessage = sendExchangeCancellationAlertMessage;
const sendReceiverDetails = async (data) => {
    let { chatId, userInformation } = data;
    let message = `Here is your information for this month's receiver.\n\n ${generateUserInformationMessageForTelegram(userInformation)}`;
    const res = await fetch(`https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "html",
        }),
    });
    const resData = await res.json();
    console.log("resData", resData);
    if (!resData.ok) {
        throw new Error(resData.description);
    }
};
exports.sendReceiverDetails = sendReceiverDetails;
const generateUserInformationMessageForTelegram = (userInformation) => {
    let message = ``;
    userInformation.map((item) => {
        const { fieldName, value, fieldId } = item;
        message = `${message}${fieldName} - ${value}\n\n`;
    });
    return message;
};
