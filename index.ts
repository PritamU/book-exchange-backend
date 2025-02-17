// server.ts
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { app, server } from "./src/app";

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.send(`Server running at port ${PORT}`);
});

// catch 404 and forward to error handler
app.use("*", function (req: Request, res: Response, next: NextFunction) {
  console.log("Route Not Found");
  return next(createHttpError(StatusCodes.NOT_FOUND, "Route not Found!"));
});

// error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log("main error handler", error.message);
  return res.status(error.status || 500).json({
    status: false,
    message: error.message,
  });
});

const host: unknown = "0.0.0.0" as unknown;
const temp: number = host as number;

server.listen(PORT, temp, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;
