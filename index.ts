// server.ts
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { app, server } from "./src/app";
import { sequelize } from "./src/config/databaseConfig";
import entityRoutes from "./src/routes/entityRoutes";
import metadataRoutes from "./src/routes/metadataRoutes";

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.send(`Server running at port ${PORT}`);
});

app.use("/entity", entityRoutes);
app.use("/metadata", metadataRoutes);

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

// Sync Database and Start Server
sequelize
  .sync()
  .then(() => {
    console.log("Database connected and synced");
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default server;
