import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import referenteRoutes from "./referente/referente.routes.js";
import referidoRoutes from "./referente/referido.routes.js";
import solicitudRoutes from "./referente/solicitud.routes.js";
import planRoutes from "./admin/plan.routes.js";
import nivelesRoutes from "./admin/niveles.routes.js";
import kpiRoutes from "./admin/kpi.routes.js";
import usuarioRoutes from "./admin/usuario.routes.js";
import puntosRoutes from "./analytics/puntos.routes.js";
import rankingRoutes from "./analytics/ranking.routes.js";
import asesorReferidoRoutes from "./asesor/referido.routes.js";
import asesorReferenteRoutes from "./asesor/referente.routes.js";
import insigniaRoutes from "./admin/insignia.routes.js";

const router = Router();

/**
 * @route   /api/auth/*
 * @desc    Rutas de autenticación (register, login, logout)
 */
router.use("/auth", authRoutes);

/**
 * @route   /api/referente/*
 * @desc    Rutas del perfil y actividad del referente
 */
router.use("/referente", referenteRoutes);

/**
 * @route   /api/referidos/*
 * @desc    Rutas de gestión de referidos (para referente)
 */
router.use("/referidos", referidoRoutes);

/**
 * @route   /api/solicitudes/*
 * @desc    Rutas de solicitudes de retiro/recompensa
 */
router.use("/solicitudes", solicitudRoutes);

/**
 * @route   /api/asesor/referidos/*
 * @desc    Rutas de gestión de referidos (para asesor)
 */
router.use("/asesor/referidos", asesorReferidoRoutes);

/**
 * @route   /api/asesor/referentes/*
 * @desc    Rutas de consulta de referentes (para asesor)
 */
router.use("/asesor/referentes", asesorReferenteRoutes);

/**
 * @route   /api/planes/*
 * @desc    Rutas de gestión de planes (CRUD)
 */
router.use("/planes", planRoutes);

/**
 * @route   /api/niveles/*
 * @desc    Rutas de gestión de niveles (CRUD)
 */
router.use("/niveles", nivelesRoutes);

/**
 * @route   /api/insignias/*
 * @desc    Rutas de gestión de insignias/logros
 */
router.use("/insignias", insigniaRoutes);

/**
 * @route   /api/kpi/*
 * @desc    Rutas de KPIs y métricas administrativas
 */
router.use("/kpi", kpiRoutes);

/**
 * @route   /api/usuarios/*
 * @desc    Rutas de gestión de usuarios (admin)
 */
router.use("/usuarios", usuarioRoutes);

/**
 * @route   /api/puntos/*
 * @desc    Rutas de gestión de puntos
 */
router.use("/puntos", puntosRoutes);

/**
 * @route   /api/ranking/*
 * @desc    Rutas de ranking de referentes
 */
router.use("/ranking", rankingRoutes);

/**
 * @route   GET /api/health
 * @desc    Verificar estado del servidor
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "API funcionando correctamente",
  });
});

export default router;
