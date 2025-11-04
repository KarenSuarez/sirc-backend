import { Router } from "express";
import rewardRequestController from "../controllers/rewardRequest.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.post(
  "/solicitar",
  [authJwt.verifyToken, authJwt.isReferente],
  rewardRequestController.crearSolicitud,
);

router.get(
  "/mis-solicitudes",
  [authJwt.verifyToken, authJwt.isReferente],
  rewardRequestController.obtenerSolicitudesReferente,
);

router.get(
  "/",
  [authJwt.verifyToken, authJwt.hasRole("contador")],
  rewardRequestController.obtenerTodasLasSolicitudes,
);

router.patch(
  "/:id_solicitud",
  [authJwt.verifyToken, authJwt.hasRole("contador")],
  rewardRequestController.actualizarEstado,
);
router.patch(
  "/aprobarPdfComprobante/:id_solicitud",
  [authJwt.verifyToken, authJwt.hasRole("contador")],
  rewardRequestController.aprobarSolicitudYGenerarComprobante,
);
router.patch(
  "/rechazar/:id_solicitud",
  [authJwt.verifyToken, authJwt.hasRole("contador")],
  rewardRequestController.rechazarSolicitud,
);
router.patch(
  "/aprobar/:id_solicitud",
  [authJwt.verifyToken, authJwt.hasRole("contador")],
  rewardRequestController.aprobarSolicitud,
);
export default router;
