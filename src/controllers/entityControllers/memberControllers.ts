import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { FindOptions, Op } from "sequelize";
import { MEMBER_COOKIE_NAME } from "../../constants/common";
import { Member } from "../../models/entityModels/memberModel";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
  JwtPayloadInterface,
  PaginatedResponseData,
} from "../../types/commonTypes";
import {
  FetchMemberPaginationQueryInterface,
  FilterMemberInterface,
  MemberInfoFieldInterface,
  MemberInterface,
  MemberStatusTypes,
} from "../../types/entityTypes/memberTypes";
import { generateJwtToken, setCookieHandler } from "../../utils/cookieHandler";
import { getHasNext, paginationSortHandler } from "../../utils/paginationUtils";
import { decryptPassword, encryptPassword } from "../../utils/passwordHandler";
import { generateRandomSlug } from "../../utils/slugHandler";

// create new member
const createMember = async (
  req: Request<
    {},
    {},
    {
      name: string;
      username: string;
      password: string;
    }
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { name, password, username } = req.body;

    let slug = generateRandomSlug(name);

    let encryptedPassword = encryptPassword(password);

    let newMember = Member.build({
      id: slug,
      name,
      username,
      password: encryptedPassword,
    });

    await newMember.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Member Created!",
    };

    res.json(returnObject);
  } catch (e: any) {
    next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  } finally {
    return;
  }
};

// login member
const memberLogin = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let {
      password,
      username,
    }: {
      username: string;
      password: string;
    } = req.body;

    let member = await Member.findOne({
      where: { username: username },
      raw: true,
    });

    if (!member) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Member Not Found!"));
    }

    let { password: encryptedPassword } = member;

    if (!member) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "Your Current Credentials Has been Disabled!"
        )
      );
    }

    let generatedPassword = decryptPassword(encryptedPassword);

    if (password !== generatedPassword) {
      return next(
        createHttpError(StatusCodes.FORBIDDEN, "Incorrect Password!")
      );
    }

    let payload: JwtPayloadInterface = {
      name: username,
      id: member.id,
    };

    let jwtToken = generateJwtToken(payload);

    setCookieHandler(MEMBER_COOKIE_NAME, jwtToken, res, "long");

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Login Successful!",
    };
    res.json(returnObject);
  } catch (e: any) {
    next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  } finally {
    return;
  }
};

// member auth
const memberAuth = async (
  req: Request,
  res: Response<BasicDataResponseInterface<MemberInterface>>,
  next: NextFunction
) => {
  try {
    let { id } = req.user!;

    const member = await Member.findOne({
      where: { id: id },
      raw: true,
      attributes: { exclude: ["password", " createdAt", " updatedAt"] },
    });

    if (!member) {
      throw new Error("Server Error : Member not found!");
    }

    let returnObject: BasicDataResponseInterface<MemberInterface> = {
      status: true,
      data: member,
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// member logout
const memberLogout = async (
  req: Request,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    res.clearCookie(MEMBER_COOKIE_NAME, { domain: process.env.COOKIE_DOMAIN });

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Logged Out!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// edit member info
const editMemberInfo = async (
  req: Request<
    {},
    {},
    {
      data: MemberInfoFieldInterface[];
    }
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { data } = req.body;

    let { id: memberId } = req.user;

    let [affectedCount] = await Member.update(
      {
        userInformation: data,
      },
      { where: { id: memberId } }
    );

    if (affectedCount === 0) {
      throw new Error("Some Error Occured!");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Member Details Updated!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// update member status
const updateMemberStatus = async (
  req: Request<
    {},
    {},
    { memberId: string; status: MemberStatusTypes; reasonForRejection?: string }
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { memberId, status, reasonForRejection } = req.body;

    let [affectedCount] = await Member.update(
      {
        status,
        reasonForRejection,
      },
      { where: { id: memberId } }
    );

    if (affectedCount === 0) {
      throw new Error("Some Error Occured!");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Member Status Updated!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch members
const fetchMembers = async (
  req: Request<{}, {}, {}, FetchMemberPaginationQueryInterface>,
  res: Response<
    BasicDataResponseInterface<PaginatedResponseData<MemberInterface[]>>
  >,
  next: NextFunction
) => {
  try {
    let { page, limit, sortField, sortValue, status, searchKey } = req.query;

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    let filterObject: FilterMemberInterface = {
      limit: newLimit,
      offset: skip,
      where: {},
      order: sortArray,
      attributes: { exclude: ["password"] },
      raw: true,
    };

    if (status) {
      filterObject.where!.status = status;
    }
    if (searchKey) {
      filterObject.where[Op.or] = [
        {
          userInformation: {
            [Op.contains]: [{ fieldName: "username", value: searchKey }],
          },
        },
        {
          userInformation: {
            [Op.contains]: [
              { fieldName: "telegramUsername", value: searchKey },
            ],
          },
        },
        {
          userInformation: {
            [Op.contains]: [{ fieldName: "redditUsername", value: searchKey }],
          },
        },
        {
          userInformation: {
            [Op.contains]: [{ fieldName: "penName", value: searchKey }],
          },
        },
      ];
    }

    console.log("filterObject", filterObject);

    let count = await Member.count(filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedResponseData<MemberInterface[]>
    > = {
      status: true,
      data: {
        count: 0,
        hasNext: false,
        data: [],
      },
    };

    if (count > 0) {
      let members = await Member.findAll({ ...filterObject });

      let hasNext = getHasNext(newPage, newLimit, count);

      returnObject = {
        status: true,
        data: { count, hasNext, data: members },
      };
    }

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// delete member
const deleteMember = async (
  req: Request<{}, {}, { memberId: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { memberId } = req.body;

    let affectedCount = await Member.destroy({ where: { id: memberId } });

    if (affectedCount === 0) {
      throw new Error("Some Error Occured");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Member Deleted!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch member login credentials
const fetchMemberLoginCredentials = async (
  req: Request<{}, {}, {}, { memberId: string }>,
  res: Response<BasicDataResponseInterface<string>>,
  next: NextFunction
) => {
  try {
    let { memberId } = req.query;

    let data = await Member.findOne({
      where: { id: memberId! },
      raw: true,
      attributes: { include: ["password"] },
    });

    if (!data) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Member Not Found!"));
    }

    let { password: encryptedPassword } = data;

    let password = decryptPassword(encryptedPassword);

    let returnObject: BasicDataResponseInterface<string> = {
      status: true,
      data: password,
    };

    res.json(returnObject);
  } catch (e: any) {
    next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  } finally {
    return;
  }
};

// telegram webhook
const telegramWebhook = async (
  req: Request<
    {},
    {},
    { message: { chat: { id: string; username: string } } },
    {}
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { chat } = req.body.message;

    console.log("req.body", req.body);

    // let member = await Member.findOne({
    //   where: {
    //     userInformation: {
    //       [Op.contains]: [
    //         { fieldId: "telegramUsername", value: chat.username },
    //       ],
    //     },
    //   },
    // });

    interface FilterInterface extends FindOptions {
      where?: {
        userInformation: {
          [Op.contains]: { fieldId: string; value: string }[];
        };
      };
    }

    let filterObject: FilterInterface = {
      where: {
        userInformation: {
          [Op.contains]: [
            { fieldId: "telegramUsername", value: chat.username },
          ],
        },
      },
    };

    console.log("filterObject", filterObject);

    let member = await Member.findOne(filterObject);

    console.log("member", member);

    if (!member) {
      throw new Error("No Member Found");
    }

    member.set("telegramChatId", chat.id);

    console.log("member after", member);

    await member.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "success",
    };

    res.json(returnObject);
  } catch (e: any) {
    next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  } finally {
    return;
  }
};

export {
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
};
