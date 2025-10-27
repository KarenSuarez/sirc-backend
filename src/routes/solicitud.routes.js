import express from "express";
import { generarCuentaCobro } from "../controllers/solicitud.controller.js";

const router = express.Router();

// Endpoint para generar la cuenta de cobro en PDF
router.get("/cuenta-cobro/:id", generarCuentaCobro);

export default router;
