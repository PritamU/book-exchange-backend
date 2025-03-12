"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
// src/app.ts
// module imports
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
// router imports
// import entityRoutes from "./routes/entityRoutes";
// import metadataRoutes from "./routes/metadataRoutes";
const app = (0, express_1.default)();
exports.app = app;
// .env configuration
dotenv_1.default.config();
let ENV = process.env.APP_ENV;
let isDev = ENV === "dev" ? true : false;
const server = http_1.default.createServer(app);
exports.server = server;
app.use((0, morgan_1.default)("dev"));
const allowedOrigins = [
    "https://faucetbase-client.netlify.app",
    "http://localhost:3000",
    "https://localhost:3000",
    "https://192.168.31.187:3000",
    "http://192.168.31.187:3000",
    "http://localhost:5173",
    "https://faucetbase-client.vercel.app",
];
// Enable CORS for all specific origin
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log("origin", origin);
        let allowed = true;
        if (origin) {
            allowed =
                origin.includes("faucetbase.in") || origin.includes("localhost");
        }
        // Check if the request's origin is in the allowed origins list
        if (allowed) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
