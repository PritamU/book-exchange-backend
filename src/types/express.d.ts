import { JwtPayloadInterface } from "../types/commonTypes"; // Adjust path as needed

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayloadInterface;
  }
}
