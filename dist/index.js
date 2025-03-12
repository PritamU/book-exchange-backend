"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const app_1 = require("./src/app");
const databaseConfig_1 = require("./src/config/databaseConfig");
const entityRoutes_1 = __importDefault(require("./src/routes/entityRoutes"));
const metadataRoutes_1 = __importDefault(require("./src/routes/metadataRoutes"));
const PORT = process.env.PORT || 3000;
app_1.app.get("/", (req, res) => {
    return res.send(`Server running at port ${PORT}`);
});
app_1.app.use("/entity", entityRoutes_1.default);
app_1.app.use("/metadata", metadataRoutes_1.default);
// catch 404 and forward to error handler
app_1.app.use("*", function (req, res, next) {
    console.log("Route Not Found");
    return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Route not Found!"));
});
// error handler
app_1.app.use((error, req, res, next) => {
    console.log("main error handler", error.message);
    return res.status(error.status || 500).json({
        status: false,
        message: error.message,
    });
});
// Sync Database and Start Server
databaseConfig_1.sequelize
    .sync()
    .then(() => {
    console.log("Database connected and synced");
    app_1.server.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
exports.default = app_1.server;
