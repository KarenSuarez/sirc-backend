import express from "express";
import { exportarRankingCSV } from "../controllers/kpiController.js";

const router = express.Router();

router.get("/ranking/export-csv", exportarRankingCSV);

export default router;
