// import { NextFunction, RequestHandler, Response } from "express";
// import createHttpError from "http-errors";
// import jwt from "jsonwebtoken";
// import { ErrorCodes } from "../../constants/errorCodes";
// import { CustomRequest } from "../../interfaces/primary/common";
// import { PermissionDB } from "../../interfaces/primary/entityInterfaces/adminInterfaces";
// import { errorHandler } from "../../utils/errorHandler";

// //check if its admin
// const adminCheck = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction,
//   accessType: "read" | "write" | "auth"
// ) => {
//   try {
//     interface AdminUser {
//       name: string;
//       _id: string;
//     }

//     let token =
//       req.cookies["connect.sid"] || req.headers["authorization"]?.split(" ")[1];

//     if (!token) {
//       return next(
//         createHttpError(ErrorCodes.unauthenticated, "Login Required!")
//       );
//     }

//     // Verify the token and extract the payload
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return next(
//           createHttpError(ErrorCodes.unauthenticated, "Invalid Token!")
//         );
//       }
//       // Token verification successful, decoded contains the payload
//       req.user = decoded;
//     });

//     let admin = req.user;

//     let { _id: adminId } = admin || {};

//     let adminModel = req.models.adminModel;

//     //fetch admin data
//     let adminData = await adminModel
//       .findOne({
//         _id: adminId,
//       })
//       .select("deleted permissions")
//       .lean();

//     // return error if admin data not found
//     if (!adminData) {
//       return next(
//         createHttpError(
//           ErrorCodes.unauthenticated,
//           "Admin Credentials Invalid!"
//         )
//       );
//     }

//     let { deleted, permissions } = adminData;

//     // return error if admin is deleted
//     if (deleted) {
//       return next(
//         createHttpError(
//           ErrorCodes.unauthorized,
//           "Your Current Admin Credentials Has been Disabled!"
//         )
//       );
//     }

//     // check if admin has access to this path
//     let path = req.originalUrl;
//     let isAllowed = permissions?.some((permission: PermissionDB) => {
//       let { route, read, write } = permission;
//       if (!path.includes(`/${route}`)) {
//         return false;
//       }

//       if (accessType === "read") {
//         return read;
//       }
//       if (accessType === "write") {
//         return write;
//       }
//     });

//     // allow everytime if it's auth path
//     if (path.includes("/admin/auth")) {
//       isAllowed = true;
//     }

//     // return error if admin does not have access
//     if (!isAllowed) {
//       return next(
//         createHttpError(
//           ErrorCodes.unauthorized,
//           "You do not have access to perform this action!"
//         )
//       );
//     }
//   } catch (e: any) {
//     errorHandler(e, res, next);
//   } finally {
//     return next();
//   }
// };

// //check if its admin read request
// const readAdminCheck = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   adminCheck(req, res, next, "read");
// };

// //check if its admin read request
// const writeAdminCheck: RequestHandler = async (
//   req,
//   res: Response,
//   next: NextFunction
// ) => {
//   adminCheck(req, res, next, "write");
// };

// //check if its admin read request
// const adminAuthCheck = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   adminCheck(req, res, next, "auth");
// };

// const checkAdminForSocket = (cookie: string) => {
//   // Verify the token and extract the payload
//   jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       throw new Error("Invalid Login Credentials!");
//     }
//     // Token verification successful, decoded contains the payload
//   });
// };

// export { adminAuthCheck, checkAdminForSocket, readAdminCheck, writeAdminCheck };
