import express from "express";
import { obtenerRankingReferentes } from "../controllers/ranking.controller.js";

const router = express.Router();

// Endpoint: /api/ranking?tipo=puntos o /api/ranking?tipo=referidos
router.get("/", obtenerRankingReferentes);

export default router;
