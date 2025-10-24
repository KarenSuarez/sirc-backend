import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import userController from "../controllers/user.controller.js";

const router = Router();

/**
 * Ruta protegida: solo necesita estar autenticado
 * Se revisa el token
 */
router.get(
  "/profile",
  [authJwt.verifyToken, authJwt.isAliveToken], 
  userController.getProfile
);

/**
 * Ruta solo para ADMINISTRADOR
 * Se revisa el token y luego el rol
 */
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.hasRole("admin")],
  userController.adminBoard
);
router.get(
  "/admin/showSessions",
  [authJwt.verifyToken, authJwt.hasRole("admin")],
  userController.showSessions
)
/**
 * Ruta solo para REFERENTE
 */
router.get(
  "/referente",
  [authJwt.verifyToken, authJwt.hasRole("referente")],
  userController.referenteBoard
);

/**
 * Ruta solo para ASESOR INTERNO
 */
router.get(
  "/asesor",
  [authJwt.verifyToken, authJwt.hasRole("asesor interno")],
  userController.asesorBoard
);

/**
 * Ruta solo para GERENTE DE VENTAS
 */
router.get(
  "/gerente",
  [authJwt.verifyToken, authJwt.hasRole("gerente de ventas")],
  userController.gerenteBoard
);

export default router;
