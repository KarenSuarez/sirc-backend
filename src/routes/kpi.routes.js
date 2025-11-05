import express from "express";
import kpiController from "../controllers/kpi.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/ranking/export-csv", [authJwt.verifyToken, authJwt.hasRole('gerente')],
  kpiController.exportarRankingCSV);

export default router;
