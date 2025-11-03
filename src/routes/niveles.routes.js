import { Router } from "express";
import nivelController from "../controllers/niveles.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.get("/", nivelController.listarNiveles);
router.post(
  "/",
  [authJwt.verifyToken, authJwt.hasRole('admin')],
  nivelController.crearNivel,
);
router.put(
  "/:id_nivel",
  [authJwt.verifyToken, authJwt.hasRole('admin')],
  nivelController.actualizarNivel,
);

export default router;
