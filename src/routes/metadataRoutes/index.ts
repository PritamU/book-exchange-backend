import express from "express";
import exchangeRoutes from "./exchangeRoutes";
import generalInfoRoutes from "./generalInfoRoutes";

let router = express.Router();

router.use("/exchange", exchangeRoutes);
router.use("/general-info", generalInfoRoutes);

export default router;
