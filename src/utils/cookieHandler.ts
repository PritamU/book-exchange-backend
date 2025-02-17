import { Response } from "express";
import jwt from "jsonwebtoken";
import { SESSION_MINUTES } from "../constants/common";
import { AdminTokenPayload } from "../interfaces/primary/entityInterfaces/adminInterfaces";

interface UserJwtTokenPayload extends AdminTokenPayload {
  exp?: number;
}

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "none" | "lax" | "strict" | false;
  maxAge: number;
  domain?: string;
  overwrite?: boolean;
}

export const setCookieHandler = (
  name: string,
  value: string,
  res: Response,
  duration: "short" | "long"
) => {
  let isDev = process.env.APP_ENV === "dev" ? true : false;

  let expiryTime = 28 * 24 * 60 * 60 * 1000;

  if (duration === "short") {
    expiryTime = SESSION_MINUTES * 60 * 60 * 1000;
  }

  const secureCookieOptions: CookieOptions = {
    maxAge: expiryTime,
    domain: isDev ? "localhost" : process.env.CORS_DOMAIN,
    sameSite: isDev ? false : "none",
    secure: isDev ? false : true,
    httpOnly: isDev ? false : true,
  };

  res.cookie(name, value, secureCookieOptions);
};

export const generateJwtToken = (payload: UserJwtTokenPayload) => {
  const JWT_TOKEN_SECRET: string = process.env.JWT_SECRET!; // telling ts that value of this string will never be null to avoid error.
  const iat = Math.floor(Date.now() / 1000);
  payload.exp = iat + 2630000;
  const token = jwt.sign(payload, JWT_TOKEN_SECRET);
  return token;
};
