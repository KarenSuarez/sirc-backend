import express from "express";
import { obtenerHistorialCategorias, crearHistorialCategoria } from "../controllers/historialCategoria.controller.js";

const router = express.Router();

router.get("/", obtenerHistorialCategorias);
router.post("/", crearHistorialCategoria);

export default router;
