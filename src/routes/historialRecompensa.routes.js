import express from "express";
import { listarHistorial, registrarRecompensa, historialPorReferente } from "../controllers/historialRecompensa.controller.js";

const router = express.Router();

// GET - Listar todo el historial
router.get("/", listarHistorial);

// POST - Registrar nueva recompensa
router.post("/", registrarRecompensa);

// GET - Ver historial por documento
router.get("/:documento", historialPorReferente);

export default router;
