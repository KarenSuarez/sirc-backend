import { Router } from "express";
import { listarHistorialNiveles, historialNivelPorReferente } from "../controllers/historialNivel.controller.js";
import { listarHistorialCategorias, historialCategoriaPorReferente } from "../controllers/historialCategoria.controller.js";
import { registrarMovimiento } from "../controllers/movimiento.controller.js";

const router = Router();


router.post("/movimientos", registrarMovimiento);


router.get("/niveles", listarHistorialNiveles);
router.get("/niveles/:documento", historialNivelPorReferente);


router.get("/categorias", listarHistorialCategorias);
router.get("/categorias/:documento", historialCategoriaPorReferente);

export default router;
