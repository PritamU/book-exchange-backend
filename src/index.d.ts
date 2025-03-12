import * as express from "express";
import { JwtPayloadInterface } from "./types/commonTypes";

declare global {
  namespace Express {
    interface Request extends express.Request {
      user?: JwtPayloadInterface;
    }
  }
}
