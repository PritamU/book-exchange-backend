import { MemberInfoFieldInterface } from "../types/entityTypes/memberTypes";

const sendWelcomeMessage = async (chatId: string, username: string) => {
  const res = await fetch(
    `https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId!,
        text: `Hi ${username}!\n\nWe're Excited to have you here\n\nYours Truly,\nuwuBot`,
        parse_mode: "html",
      }),
    }
  );
  const resData: { ok: boolean; description: string } = await res.json();
  console.log("resData", resData);
  if (!resData.ok) {
    throw new Error(resData.description);
  }
};

const sendExchangeCreationAlertMessage = async () => {
  const res = await fetch(
    `https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_GROUP!,
        text: `Attention\n\nA new Exchange Has Been Initiated For this month. Please visit ${process.env.CLIENT_URL} to participate in the exchange!`,
        parse_mode: "html",
      }),
    }
  );
  const resData: { ok: boolean; description: string } = await res.json();
  console.log("resData", resData);
  if (!resData.ok) {
    throw new Error(resData.description);
  }
};

const sendExchangeCancellationAlertMessage = async (exchangeId: string) => {
  const res = await fetch(
    `https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_GROUP!,
        text: `Attention\n\nAn exchange with ID ${exchangeId} has been Cancelled.!`,
        parse_mode: "html",
      }),
    }
  );
  const resData: { ok: boolean; description: string } = await res.json();
  console.log("resData", resData);
  if (!resData.ok) {
    throw new Error(resData.description);
  }
};

const sendReceiverDetails = async (data: {
  chatId: string;
  userInformation: MemberInfoFieldInterface[];
}) => {
  let { chatId, userInformation } = data;

  let message = `Here is your information for this month's receiver.\n\n ${generateUserInformationMessageForTelegram(
    userInformation
  )}`;

  const res = await fetch(
    `https://api.telegram.org/${process.env.TELEGRAM_API_KEY}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "html",
      }),
    }
  );
  const resData: { ok: boolean; description: string } = await res.json();
  console.log("resData", resData);
  if (!resData.ok) {
    throw new Error(resData.description);
  }
};

const generateUserInformationMessageForTelegram = (
  userInformation: MemberInfoFieldInterface[]
) => {
  let message = ``;
  userInformation.map((item) => {
    const { fieldName, value, fieldId } = item;
    message = `${message}${fieldName} - ${value}\n\n`;
  });
  return message;
};

export {
  sendExchangeCancellationAlertMessage,
  sendExchangeCreationAlertMessage,
  sendReceiverDetails,
  sendWelcomeMessage,
};
