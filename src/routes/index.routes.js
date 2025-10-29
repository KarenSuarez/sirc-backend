import { Router } from "express";
import authRoutes from "./auth.routes.js";
import referedRoutes from "./refered.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/referidos", referedRoutes);
router.use("/users", userRoutes);

export default router;
