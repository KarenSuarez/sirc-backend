import { Router } from 'express';
import authRoutes from './auth.routes.js';
import referedRoutes from './refered.routes.js';
import solicitudRoutes from './rewardRequest.routes.js';
import pointsRoutes from './points.routes.js';
import nivelesRoutes from "./niveles.routes.js";
import beneficiosRoutes from "./beneficios.routes.js";
import rankingRoutes from "./ranking.routes.js";
import kpiRoutes from "./kpi.routes.js";
import historialRecompensaRoutes from "./historialRecompensa.routes.js";
import historialCategoriaRoutes from "./historialCategorias.routes.js";
import userRoutes from "./user.routes.js";
import rewardCatalogoRoutes from './rewardCatalogo.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/refereds', referedRoutes);
router.use("/solicitudes", solicitudRoutes);
router.use('/points', pointsRoutes);
router.use("/niveles", nivelesRoutes);
router.use("/beneficios", beneficiosRoutes);
router.use("/ranking", rankingRoutes);
router.use("/kpis", kpiRoutes);
router.use("/historial-recompensas", historialRecompensaRoutes);
router.use("/historial-categorias", historialCategoriaRoutes);
router.use('/catalogo', rewardCatalogoRoutes);
router.use("/users", userRoutes);
export default router;
