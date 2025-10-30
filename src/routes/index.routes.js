import { Router } from 'express';
import authRoutes from './auth.routes.js';
import referedRoutes from './refered.routes.js';
import rewardRequestRoutes from './rewardRequest.routes.js';
import userRoutes from "./user.routes.js";
import pointsRoutes from './points.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/refereds', referedRoutes);
router.use("/users", userRoutes);
router.use('/rewardRequests', rewardRequestRoutes);
router.use('/points', pointsRoutes);
export default router;
