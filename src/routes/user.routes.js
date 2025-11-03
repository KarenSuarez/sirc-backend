import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import userAdminController from "../controllers/userAdmin.controller.js";
import userReferenteController from "../controllers/userReferente.controller.js";
import userGerenteController from "../controllers/userGerente.controller.js";
import userController from "../controllers/user.controller.js"

const router = Router();

/** Ruta protegida: solo necesita estar autenticado Se revisa el token */
router.get(
  "/miperfil",
  [authJwt.verifyToken, authJwt.isAliveToken],
  userController.getProfile,
);
router.put(
  "/miperfil",
  [authJwt.verifyToken, authJwt.isAliveToken],
  userController.updateUserData
)
/** Ruta solo para REFERENTE */
router.get(
  "/referente/info",
  [authJwt.verifyToken, authJwt.hasRole("referente")],
  userReferenteController.infoPerfilReferente,
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

/** Ruta solo para ASESOR INTERNO */
router.get(
  "/asesor",
  [authJwt.verifyToken, authJwt.hasRole("asesor")],
  userAdminController.asesorBoard,
);

/** Ruta solo para GERENTE DE VENTAS */
router.get(
  "/gerente",
  [authJwt.verifyToken, authJwt.hasRole("gerente"), authJwt.isAliveToken],
  userGerenteController.gerenteBoardAllStats
);
router.get(
  "/gerente/analisisVentas",
  [authJwt.verifyToken, authJwt.hasRole("gerente"), authJwt.isAliveToken],
  userGerenteController.getTotalAnaliticas
)
export default router;
