import express from "express";
import adminRoutes from "./adminRoutes";
import memberRoutes from "./memberRoutes";

let router = express.Router();

router.use("/admin", adminRoutes);
router.use("/member", memberRoutes);

export default router;
