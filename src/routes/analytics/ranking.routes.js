import { Router } from "express";
import rankingController from "../../controllers/analytics/ranking.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /ranking/puntos:
 *   get:
 *     summary: Ranking de referentes por puntos
 *     description: Top referentes ordenados por puntos actuales
 *     tags: [Ranking]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [mes, trimestre, año, historico]
 *           default: mes
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Ranking por puntos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingResponse'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al obtener ranking
 */
router.get(
  "/puntos",
  [authJwt.verifyToken],
  rankingController.obtenerRankingPorPuntos
);

/**
 * @swagger
 * /ranking/comisiones:
 *   get:
 *     summary: Ranking de referentes por comisiones
 *     description: Top referentes ordenados por total de comisiones generadas
 *     tags: [Ranking]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [mes, trimestre, año, historico]
 *           default: mes
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Ranking por comisiones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingResponse'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al obtener ranking
 */
router.get(
  "/comisiones",
  [authJwt.verifyToken],
  rankingController.obtenerRankingPorComisiones
);

/**
 * @swagger
 * /ranking/referidos:
 *   get:
 *     summary: Ranking de referentes por cantidad de referidos
 *     description: Top referentes ordenados por cantidad de referidos convertidos
 *     tags: [Ranking]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [mes, trimestre, año, historico]
 *           default: mes
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Ranking por referidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingResponse'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al obtener ranking
 */
router.get(
  "/referidos",
  [authJwt.verifyToken],
  rankingController.obtenerRankingPorReferidos
);

/**
 * @swagger
 * /ranking/general:
 *   get:
 *     summary: Ranking general combinado
 *     description: Ranking considerando múltiples métricas (puntos, comisiones y referidos)
 *     tags: [Ranking]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [mes, trimestre, año, historico]
 *           default: mes
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Ranking general
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingResponse'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al obtener ranking
 */
router.get(
  "/general",
  [authJwt.verifyToken],
  rankingController.obtenerRankingGeneral
);

export default router;