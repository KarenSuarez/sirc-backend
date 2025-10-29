import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import userAdminController from "../controllers/userAdmin.controller.js";
import userReferenteController from "../controllers/userReferente.controller.js";

const router = Router();

/** Ruta protegida: solo necesita estar autenticado Se revisa el token */
router.get(
  "/profile",
  [authJwt.verifyToken, authJwt.isAliveToken],
  userAdminController.getProfile,
);

/** Ruta solo para ADMINISTRADOR Se revisa el token y luego el rol */
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.hasRole("admin")],
  userAdminController.adminBoard,
);
router.get(
  "/admin/showLiveSessions",
  [authJwt.verifyToken, authJwt.hasRole("admin")],
  userAdminController.showLiveSessions,
);

router.get(
  "/admin/showAllSessions",
  [authJwt.verifyToken, authJwt.hasRole("admin")],
  userAdminController.showAllSessions,
);
/** Ruta solo para REFERENTE */
router.get(
  "/referente",
  [authJwt.verifyToken, authJwt.hasRole("referente")],
  userReferenteController.referenteBoard,
);

/** Ruta solo para ASESOR INTERNO */
router.get(
  "/asesor",
  [authJwt.verifyToken, authJwt.hasRole("asesor interno")],
  userAdminController.asesorBoard,
);

/** Ruta solo para GERENTE DE VENTAS */
router.get(
  "/gerente",
  [authJwt.verifyToken, authJwt.hasRole("gerente de ventas")],
  userAdminController.gerenteBoard,
);

export default router;
