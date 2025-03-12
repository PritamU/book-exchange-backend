import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ADMIN_COOKIE_NAME } from "../../constants/common";
import { Admin } from "../../models/entityModels/adminModel";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
  JwtPayloadInterface,
  PaginatedResponseData,
} from "../../types/commonTypes";
import {
  AdminInterface,
  FetchAdminPaginationQueryInterface,
  FilterAdminInterface,
  Permission,
} from "../../types/entityTypes/adminTypes";
import { generateJwtToken, setCookieHandler } from "../../utils/cookieHandler";
import { getHasNext, paginationSortHandler } from "../../utils/paginationUtils";
import { comparePassword, hashPassword } from "../../utils/passwordHandler";
import { generateRandomSlug } from "../../utils/slugHandler";

// create new admin
const createAdmin = async (
  req: Request<
    {},
    {},
    {
      name: string;
      username: string;
      password: string;
      permissions: Permission[];
    }
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { name, password, permissions, username } = req.body;

    let slug = generateRandomSlug(name);

    let hashedPassword = await hashPassword(password);

    let newAdmin = Admin.build({
      id: slug,
      name,
      username,
      password: hashedPassword,
      permissions,
    });

    await newAdmin.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Created!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// login admin
const adminLogin = async (
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

    let admin = await Admin.findOne({ where: { username: username } });

    if (!admin) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Admin Not Found!"));
    }

    let { password: hashedPassword, status } = admin;

    if (!admin) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "Your Current Admin Credentials Has been Disabled!"
        )
      );
    }

    let isPasswordCorrect = await comparePassword(password, hashedPassword);

    if (!isPasswordCorrect) {
      return next(
        createHttpError(StatusCodes.FORBIDDEN, "Incorrect Password!")
      );
    }

    let payload: JwtPayloadInterface = {
      name: username,
      id: admin.id,
    };

    let jwtToken = generateJwtToken(payload);

    setCookieHandler(ADMIN_COOKIE_NAME, jwtToken, res, "long");

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Login Successful!",
    };
    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// admin auth
const adminAuth = async (
  req: Request,
  res: Response<BasicDataResponseInterface<JwtPayloadInterface>>,
  next: NextFunction
) => {
  try {
    let payload = req.user!;
    let returnObject: BasicDataResponseInterface<JwtPayloadInterface> = {
      status: true,
      data: payload,
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// admin logout
const adminLogout = async (
  req: Request,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    res.clearCookie(ADMIN_COOKIE_NAME, { domain: process.env.COOKIE_DOMAIN });

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Logged Out!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch admins
const fetchAdmins = async (
  req: Request<{}, {}, {}, FetchAdminPaginationQueryInterface>,
  res: Response<
    BasicDataResponseInterface<PaginatedResponseData<AdminInterface[]>>
  >,
  next: NextFunction
) => {
  try {
    let { page, limit, sortField, sortValue, status } = req.query;

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    let filterObject: FilterAdminInterface = {
      limit: newLimit,
      offset: skip,
      where: {},
      order: sortArray,
      attributes: { exclude: ["password"] },
    };

    if (status !== undefined) {
      filterObject.where!.status = status;
    }

    let count = await Admin.count(filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedResponseData<AdminInterface[]>
    > = {
      status: true,
      data: {
        count: 0,
        hasNext: false,
        data: [],
      },
    };

    if (count > 0) {
      let admins = await Admin.findAll({ ...filterObject });

      let hasNext = getHasNext(newPage, newLimit, count);

      returnObject = {
        status: true,
        data: { count, hasNext, data: admins },
      };
    }

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// edit Admin
const editAdmin = async (
  req: Request<
    {},
    {},
    { adminId: string; status?: boolean; permissions?: Permission[] }
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { adminId, permissions, status } = req.body;

    let [affectedCount] = await Admin.update(
      {
        permissions,
        status,
      },
      { where: { id: adminId } }
    );

    if (affectedCount === 0) {
      throw new Error("Some Error Occured");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Updated!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// delete admin
const deleteAdmin = async (
  req: Request<{}, {}, { adminId: string }>,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  try {
    let { adminId } = req.body;

    let affectedCount = await Admin.destroy({ where: { id: adminId } });

    if (affectedCount === 0) {
      throw new Error("Some Error Occured");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Deleted!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

export {
  adminAuth,
  adminLogin,
  adminLogout,
  createAdmin,
  deleteAdmin,
  editAdmin,
  fetchAdmins,
};
