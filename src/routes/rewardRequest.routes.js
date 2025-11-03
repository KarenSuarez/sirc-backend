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

export default router;
