import { Router } from "express";
import { listarNiveles, crearNivel, actualizarNivel } from "../controllers/niveles.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.get("/", listarNiveles);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], crearNivel);
router.put("/:id_nivel", [authJwt.verifyToken, authJwt.isAdmin], actualizarNivel);

export default router;
