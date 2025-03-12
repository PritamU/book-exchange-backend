import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ADMIN_COOKIE_NAME } from "../../constants/common";
import { Admin } from "../../models/entityModels/adminModel";
import { Permission } from "../../types/entityTypes/adminTypes";

//check if its admin
const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
  accessType: "read" | "write" | "auth"
) => {
  try {
    let token = req.cookies[ADMIN_COOKIE_NAME];

    if (!token) {
      return next(createHttpError(StatusCodes.UNAUTHORIZED, "Login Required!"));
    }

    // Verify the token and extract the payload
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        return next(
          createHttpError(StatusCodes.UNAUTHORIZED, "Invalid Token!")
        );
      }
      // Token verification successful, decoded contains the payload
      req.user = decoded;
    });

    let admin = req.user;

    let { id: adminId } = admin || {};

    //fetch admin data
    let adminData = await Admin.findOne({
      where: { id: adminId },
      attributes: ["permissions", "status"],
      raw: true,
    });

    // return error if admin data not found
    if (!adminData) {
      return next(
        createHttpError(StatusCodes.UNAUTHORIZED, "Admin Credentials Invalid!")
      );
    }

    let { status, permissions } = adminData;

    // return error if admin is deleted
    if (!status) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "Your Current Admin Credentials Has been Disabled!"
        )
      );
    }

    // check if admin has access to this path
    let path = req.originalUrl;
    let isAllowed = permissions?.some((permission: Permission) => {
      let { route, read, write } = permission;
      if (!path.includes(`/${route}`)) {
        return false;
      }

      if (accessType === "read") {
        return read;
      }
      if (accessType === "write") {
        return write;
      }
    });

    // allow everytime if it's auth path
    if (path.includes("/admin/auth") || path.includes("/admin/logout")) {
      isAllowed = true;
    }

    // return error if admin does not have access
    if (!isAllowed) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "You do not have access to perform this action!"
        )
      );
    }
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  } finally {
    return next();
  }
};

//check if its admin read request
const readAdminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  adminCheck(req, res, next, "read");
};

//check if its admin read request
const writeAdminCheck: RequestHandler = async (
  req,
  res: Response,
  next: NextFunction
) => {
  adminCheck(req, res, next, "write");
};

//check if its admin read request
const adminAuthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  adminCheck(req, res, next, "auth");
};

export { adminAuthCheck, readAdminCheck, writeAdminCheck };
