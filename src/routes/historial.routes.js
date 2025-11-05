import { Router } from "express";
import { listarHistorialNiveles, historialNivelPorReferente } from "../controllers/historialNivel.controller.js";
import { registrarMovimiento } from "../controllers/movimiento.controller.js";

const router = Router();


router.post("/movimientos", registrarMovimiento);


router.get("/niveles", listarHistorialNiveles);
router.get("/niveles/:documento", historialNivelPorReferente);



export default router;
