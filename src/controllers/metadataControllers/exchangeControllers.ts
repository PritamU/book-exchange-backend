import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Member } from "../../models/entityModels/memberModel";
import { Exchange } from "../../models/metadataModels/monthlyExchangeModel";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
  PaginatedResponseData,
} from "../../types/commonTypes";
import {
  ExchangeInterface,
  FetchExchangePaginationQueryInterface,
  FilterExchangeInterface,
  MembersInExchangeInterface,
} from "../../types/metadataTypes/exchangeTypes";
import { getHasNext, paginationSortHandler } from "../../utils/paginationUtils";
import { getRandomNumber } from "../../utils/random";
import {
  sendExchangeCancellationAlertMessage,
  sendExchangeCreationAlertMessage,
  sendReceiverDetails,
} from "../../utils/telegram";

// create exchange by cron
const createExchangeByCron = async (
  req: Request<{}, {}, {}>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    // get current month
    let month = dayjs().get("month");

    // check if current month exchange exist
    let exchangeExists = await Exchange.count({
      where: { month: month, [Op.not]: { status: "cancelled" } },
    });

    if (exchangeExists !== 0) {
      throw new Error("Exchange Already Exists For this month!");
    }

    // create exchange, if not exist
    let newExchange = new Exchange({
      month,
      members: [],
      status: "initiated",
      createdBy: "cron",
    });

    await newExchange.validate();

    // send telegram messages to every member
    await sendExchangeCreationAlertMessage();

    await newExchange.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Exchange Created!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// create exchange by admin
const createExchangeByAdmin = async (
  req: Request<{}, {}, {}>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    // get current month
    let month = dayjs().get("month");

    // check if current month exchange exist
    let exchangeExists = await Exchange.count({
      where: { month: month, [Op.not]: { status: "cancelled" } },
    });

    if (exchangeExists !== 0) {
      throw new Error("Exchange Already Exists For this month!");
    }

    // create exchange, if not exist
    let newExchange = new Exchange({
      month,
      members: [],
      status: "initiated",
      createdBy: "admin",
    });

    await newExchange.validate();

    // send telegram messages to every member
    await sendExchangeCreationAlertMessage();

    await newExchange.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Exchange Created!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch exchanges by admin
const fetchExchangesByAdmin = async (
  req: Request<{}, {}, {}, FetchExchangePaginationQueryInterface>,
  res: Response<
    BasicDataResponseInterface<PaginatedResponseData<ExchangeInterface[]>>
  >,
  next: NextFunction
) => {
  try {
    let { page, limit, sortField, sortValue, status, createdBy, month } =
      req.query;

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    let filterObject: FilterExchangeInterface = {
      limit: newLimit,
      offset: skip,
      where: {},
      order: sortArray,
      raw: true,
      attributes: { exclude: ["members"] },
    };

    if (status) {
      filterObject.where!.status = status;
    }
    if (month) {
      filterObject.where!.month = month;
    }
    if (createdBy) {
      filterObject.where!.createdBy = createdBy;
    }

    let count = await Exchange.count(filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedResponseData<ExchangeInterface[]>
    > = {
      status: true,
      data: {
        count: 0,
        hasNext: false,
        data: [],
      },
    };

    if (count > 0) {
      let exchanges = await Exchange.findAll({ ...filterObject });

      let hasNext = getHasNext(newPage, newLimit, count);

      returnObject = {
        status: true,
        data: { count, hasNext, data: exchanges },
      };
    }

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch exchange details by admin
const fetchExchangeDetailsByAdmin = async (
  req: Request<{ exchangeId: string }, {}, {}>,
  res: Response<BasicDataResponseInterface<any>>,
  next: NextFunction
) => {
  try {
    let { exchangeId } = req.params;

    // check if current month exchange exist
    let exchange = await Exchange.findOne({
      where: { id: exchangeId },
      raw: true,
    });

    if (!exchange) {
      throw new Error("Exchange does not exist!");
    }

    let newMembers: any[] = [];
    for (let memberItem of exchange.members) {
      let { memberId } = memberItem;
      let memberData = await Member.findOne({
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

    let returnObject: BasicDataResponseInterface<any> = {
      status: true,
      data: exchange,
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch exchanges by member
const fetchExchangesByMember = async (
  req: Request<{}, {}, {}, FetchExchangePaginationQueryInterface>,
  res: Response<
    BasicDataResponseInterface<PaginatedResponseData<ExchangeInterface[]>>
  >,
  next: NextFunction
) => {
  try {
    let { page, limit, sortField, sortValue, status, month } = req.query;

    let { id: memberId } = req.user;

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    let filterObject: FilterExchangeInterface = {
      limit: newLimit,
      offset: skip,
      where: {},
      order: sortArray,
      raw: true,
    };

    if (status) {
      filterObject.where!.status = status;
    }
    if (month) {
      filterObject.where!.month = month;
    }

    let count = await Exchange.count(filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedResponseData<ExchangeInterface[]>
    > = {
      status: true,
      data: {
        count: 0,
        hasNext: false,
        data: [],
      },
    };

    if (count > 0) {
      let exchanges: ExchangeInterface[] = await Exchange.findAll({
        ...filterObject,
      });

      let hasNext = getHasNext(newPage, newLimit, count);

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
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// participate In exchange
const participateInExchange = async (
  req: Request<{}, {}, { exchangeId: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { exchangeId } = req.body;
    let { id: memberId } = req.user;

    // check if current month exchange exist
    let exchange = await Exchange.findOne({
      where: { id: exchangeId },
    });

    if (!exchange) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Exchange Not Found!")
      );
    }

    let { status, members } = exchange;

    if (status !== "initiated") {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          `${status} exchanges cannot be joined!`
        )
      );
    }

    let memberAlreadyExists = members.findIndex(
      (item) => item.memberId === memberId
    );

    if (memberAlreadyExists !== -1) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "You have already participated in this event!"
        )
      );
    }

    exchange.memberCount += 1;
    exchange.members.push({
      memberId,
      orderCreated: false,
    });

    await exchange.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Participation Successfull!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// cancel participation
const cancelParticipation = async (
  req: Request<{}, {}, { exchangeId: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { exchangeId } = req.body;
    let { id: memberId } = req.user;

    // check if current month exchange exist
    let exchange = await Exchange.findOne({
      where: { id: exchangeId },
    });

    if (!exchange) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Exchange Not Found!")
      );
    }

    let { status, members } = exchange;

    if (status !== "initiated") {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          `${status} exchange participation cannot be cancelled!`
        )
      );
    }

    let memberExists = members.findIndex((item) => item.memberId === memberId);

    if (memberExists === -1) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "You have not participated in this event!"
        )
      );
    }

    exchange.memberCount -= 1;
    exchange.members = members.filter((_, index) => index !== memberExists);
    await exchange.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Participation Cancelled!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// assign receivers
const assignReceivers = async (
  req: Request<{}, {}, { exchangeId: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { exchangeId } = req.body;

    // check if current month exchange exist
    let exchange = await Exchange.findOne({
      where: { id: exchangeId },
    });

    if (!exchange) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Exchange Not Found!")
      );
    }

    let { status, members, memberCount } = exchange;

    if (status !== "initiated") {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          `Only initiated exchanges can be assigned receivers!`
        )
      );
    }

    let memberIndexArray: number[] = [];

    for (let i = 0; i < memberCount; i++) {
      memberIndexArray.push(i);
    }

    let assignedIndexes: number[] = [];

    let newMembers: MembersInExchangeInterface[] = [];
    let memberIndex = 0;
    for (let memberItem of members) {
      let availableIndexes: number[] = [];
      for (let i = 0; i < memberCount; i++) {
        if (i === memberIndex) {
          continue;
        }
        if (assignedIndexes.includes(i)) {
          continue;
        }
        availableIndexes.push(i);
      }
      let selectedIndex =
        availableIndexes[getRandomNumber(0, availableIndexes.length - 1)];

      assignedIndexes.push(selectedIndex);
      newMembers.push({
        ...memberItem,
        assignedMemberId: members[selectedIndex].memberId,
      });
      memberIndex += 1;
      let receiverData = await Member.findOne({
        where: { id: members[selectedIndex].memberId },
        raw: true,
        attributes: { include: ["userInformation telegramChatId"] },
      });

      if (!receiverData) {
        throw new Error("Server Error: Receiver Data Not Found!");
      }
      await sendReceiverDetails({
        chatId: receiverData.telegramChatId,
        userInformation: receiverData.userInformation,
      });
    }

    exchange.status = "in-progress";
    exchange.members = newMembers;
    await exchange.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Receivers Assigned!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// cancel Exchange
const cancelExchange = async (
  req: Request<{}, {}, { exchangeId: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { exchangeId } = req.body;

    // check if current month exchange exist
    let [affectedCount] = await Exchange.update(
      {
        status: "cancelled",
      },
      {
        where: { id: exchangeId },
      }
    );

    if (affectedCount === 0) {
      throw new Error("Some Error Occured!");
    }

    await sendExchangeCancellationAlertMessage(exchangeId);

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Exchange Cancelled!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

export {
  assignReceivers,
  cancelExchange,
  cancelParticipation,
  createExchangeByAdmin,
  createExchangeByCron,
  fetchExchangeDetailsByAdmin,
  fetchExchangesByAdmin,
  fetchExchangesByMember,
  participateInExchange,
};
