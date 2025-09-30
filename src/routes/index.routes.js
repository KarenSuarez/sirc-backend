import { Router } from 'express';
import authRoutes from './auth.routes.js';
import referedRoutes from './refered.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/refereds', referedRoutes);

export default router;
