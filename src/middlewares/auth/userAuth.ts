import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { MEMBER_COOKIE_NAME } from "../../constants/common";
import { Member } from "../../models/entityModels/memberModel";

// check authentication for user
const userAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("here");
    let token = req.cookies[MEMBER_COOKIE_NAME];

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

    let userId: string = req.user!.id as string;

    //fetch admin data
    let user = await Member.count({
      where: { id: userId },
    });

    // return error if admin data not found
    if (user === 0) {
      return next(
        createHttpError(StatusCodes.FORBIDDEN, "User Credentials Invalid!")
      );
    }
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  } finally {
    return next();
  }
};

export { userAuthMiddleware };
