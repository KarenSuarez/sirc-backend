import { Router } from "express";
import puntosController from "../../controllers/analytics/puntos.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /puntos/mi-historial:
 *   get:
 *     summary: Obtener historial de puntos del referente autenticado
 *     description: Lista todos los movimientos de puntos (ganados, canjeados, etc.) del referente
 *     tags: [Puntos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Historial de puntos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 puntos_actuales:
 *                   type: integer
 *                   example: 150
 *                 puntos_totales_historico:
 *                   type: integer
 *                   example: 300
 *                 historial:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_movimiento:
 *                         type: integer
 *                       puntos_otorgados:
 *                         type: integer
 *                       fecha_movimiento:
 *                         type: string
 *                         format: date-time
 *                       referido:
 *                         type: object
 *       403:
 *         description: Requiere rol de referente
 *       500:
 *         description: Error al obtener historial
 */
router.get(
  "/mi-historial",
  [authJwt.verifyToken, authJwt.isReferente],
  puntosController.obtenerMiHistorial
);

export default router;