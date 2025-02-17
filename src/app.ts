// src/app.ts
// module imports
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import morgan from "morgan";

// router imports
// import entityRoutes from "./routes/entityRoutes";
// import metadataRoutes from "./routes/metadataRoutes";

const app = express();

// .env configuration
dotenv.config();
let ENV = process.env.APP_ENV;
let isDev = ENV === "dev" ? true : false;

const server = http.createServer(app);

app.use(morgan("dev"));

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
app.use(
  cors({
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
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure cookie session

export { app, server };
