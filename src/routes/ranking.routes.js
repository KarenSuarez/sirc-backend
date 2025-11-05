import express from "express";
import { obtenerRankingReferentes } from "../controllers/ranking.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/ranking:
 *   get:
 *     summary: Obtiene el ranking de referentes activos
 *     description: >
 *       Retorna un listado con los referentes activos, ordenados según el criterio seleccionado:
 *       - **puntos** → Ordena por puntos acumulados (por defecto).  
 *       - **referidos** → Ordena por cantidad total de referidos registrados.  
 *       Puedes limitar la cantidad de resultados devueltos con el parámetro `limite`.
 *     tags:
 *       - Ranking
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [puntos, referidos]
 *           default: puntos
 *         description: Criterio de ordenamiento del ranking.
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de referentes a devolver.
 *     responses:
 *       200:
 *         description: Ranking obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ranking obtenido correctamente
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       numero_documento_identidad:
 *                         type: string
 *                         example: "123456789"
 *                       tipo_referente:
 *                         type: string
 *                         example: "cliente externo"
 *                       puntos_acumulados:
 *                         type: integer
 *                         example: 2500
 *                       categoria_actual:
 *                         type: string
 *                         example: "Plata"
 *                       recompensa_monetaria_actual:
 *                         type: number
 *                         format: float
 *                         example: 125000.50
 *                       total_referidos:
 *                         type: integer
 *                         example: 8
 *       400:
 *         description: Tipo de ranking inválido (parámetro incorrecto).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de ranking inválido (use 'puntos' o 'referidos')"
 *       500:
 *         description: Error interno al obtener el ranking.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener ranking de referentes"
 *                 error:
 *                   type: string
 *                   example: "Error de conexión o consulta SQL"
 */

router.get("/", obtenerRankingReferentes);

export default router;
