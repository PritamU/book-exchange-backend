// import { NextFunction, RequestHandler, Response } from "express";
// import createHttpError from "http-errors";
// import jwt from "jsonwebtoken";
// import { ErrorCodes } from "../../constants/errorCodes";
// import { CustomRequest } from "../../interfaces/primary/common";
// import { errorHandler } from "../../utils/errorHandler";

// // check authentication for user
// const userAuthMiddleware: RequestHandler = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log("here");
//     let token =
//       req.cookies["user.sid"] || req.headers["authorization"]?.split(" ")[1];

//     if (!token) {
//       return next(
//         createHttpError(ErrorCodes.unauthenticated, "Login Required!")
//       );
//     }

//     // Verify the token and extract the payload
//     jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
//       if (err) {
//         return next(
//           createHttpError(ErrorCodes.unauthenticated, "Invalid Token!")
//         );
//       }
//       // Token verification successful, decoded contains the payload
//       req.user = decoded;
//     });

//     let userId: string = req.user._id as string;

//     //fetch admin data
//     let user = await req.models?.userModel
//       .findOne({
//         _id: userId,
//       })
//       .select("status")
//       .lean();

//     // return error if admin data not found
//     if (!user) {
//       return next(
//         createHttpError(ErrorCodes.unauthenticated, "User Credentials Invalid!")
//       );
//     }

//     let { status } = user;

//     // return error if user is deleted
//     if (!status) {
//       return next(
//         createHttpError(
//           ErrorCodes.unauthorized,
//           "Your Account Has Been Blocked!"
//         )
//       );
//     }
//   } catch (e: any) {
//     errorHandler(e, res, next);
//   } finally {
//     return next();
//   }
// };
// // check optional authentication for user
// const userOptionalAuthMiddleware: RequestHandler = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let token =
//       req.cookies["user.sid"] || req.headers["authorization"]?.split(" ")[1];

//     if (!token) {
//       return;
//     }

//     // Verify the token and extract the payload
//     jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
//       if (err) {
//         return next(
//           createHttpError(ErrorCodes.unauthenticated, "Invalid Token!")
//         );
//       }
//       // Token verification successful, decoded contains the payload
//       req.user = decoded;
//     });

//     let userId: string = req.user._id as string;

//     //fetch admin data
//     let user = await req.models?.userModel
//       .findOne({
//         _id: userId,
//       })
//       .select("status")
//       .lean();

//     // return error if admin data not found
//     if (!user) {
//       return next(
//         createHttpError(ErrorCodes.unauthenticated, "User Credentials Invalid!")
//       );
//     }

//     let { status } = user;

//     // return error if user is deleted
//     if (!status) {
//       return next(
//         createHttpError(
//           ErrorCodes.unauthorized,
//           "Your Account Has Been Blocked!"
//         )
//       );
//     }
//   } catch (e: any) {
//     errorHandler(e, res, next);
//   } finally {
//     return next();
//   }
// };

// export { userAuthMiddleware, userOptionalAuthMiddleware };
