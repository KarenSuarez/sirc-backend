import express from "express";
import kpiController from "../controllers/kpi.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = express.Router();

/**
 * @swagger
 * /kpis/ranking/export-csv:
 *   get:
 *     summary: Exporta el ranking de referentes a un archivo CSV
 *     description: >
 *       Genera un ranking de referentes con sus puntos acumulados, categoría actual,
 *       cantidad de referidos, recompensas totales y tasa de conversión.  
 *       El resultado se exporta en formato **CSV** y se descarga automáticamente.
 *     tags:
 *       - KPIs
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: Archivo CSV exportado exitosamente.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *             example: |
 *               Documento,Nombre,Apellido,Categoria,Puntos_Acumulados,Total_Referidos,Recompensa_Total,Tasa_Conversion
 *               123456789,Laura,Vela,Oro,1200,5,30000,80.00%
 *       500:
 *         description: Error al generar el archivo CSV.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error exportando CSV"
 *                 error:
 *                   type: string
 *                   example: "Error de conexión o consulta SQL"
 */


router.get("/ranking/export-csv", [authJwt.verifyToken, authJwt.hasRole('gerente')],
  kpiController.exportarRankingCSV);

export default router;
