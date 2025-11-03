import { Router } from 'express';
import authRoutes from './auth.routes.js';
import referedRoutes from './refered.routes.js';
import rewardRequestRoutes from './rewardRequest.routes.js';
import userRoutes from "./user.routes.js";
import pointsRoutes from './points.routes.js';
import nivelesRoutes from "./niveles.routes.js";
import beneficiosRoutes from "./beneficios.routes.js";
import configPointsPlanRoutes from "./configPointsPlan.routes.js";
import rankingRoutes from "./ranking.routes.js";
import rewardCatalogoRoutes from './rewardCatalogo.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/refereds', referedRoutes);
router.use("/users", userRoutes);
router.use('/rewardRequests', rewardRequestRoutes);
router.use('/points', pointsRoutes);
router.use("/niveles", nivelesRoutes);
router.use("/beneficios", beneficiosRoutes);
router.use("/config-puntos-plan", configPointsPlanRoutes);
router.use("/ranking", rankingRoutes);
router.use('/catalogo', rewardCatalogoRoutes);
export default router;
