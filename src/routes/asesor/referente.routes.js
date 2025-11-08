import { Router } from "express";
import asesorController from "../../controllers/asesor/asesor.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

router.use([authJwt.verifyToken, authJwt.hasRole("asesor_ventas", "administrador")]);

/**
 * @swagger
 * /asesor/referentes:
 *   get:
 *     summary: Listar todos los referentes
 *     description: Ver todos los referentes del sistema con sus métricas de referidos
 *     tags: [Asesor - Referentes]
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
 *         description: Lista de referentes con métricas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 pagina:
 *                   type: integer
 *                   example: 1
 *                 limite:
 *                   type: integer
 *                   example: 50
 *                 total_paginas:
 *                   type: integer
 *                   example: 1
 *                 referentes:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Referente'
 *                       - type: object
 *                         properties:
 *                           metricas:
 *                             type: object
 *                             properties:
 *                               total_referidos:
 *                                 type: integer
 *                                 example: 5
 *                               referidos_activos:
 *                                 type: integer
 *                                 example: 3
 *       500:
 *         description: Error al listar referentes
 */
router.get("/", asesorController.listarReferentes);

/**
 * @swagger
 * /asesor/referentes/{id}:
 *   get:
 *     summary: Obtener detalle de un referente
 *     description: Ver información completa de un referente específico con sus métricas
 *     tags: [Asesor - Referentes]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del referente
 *     responses:
 *       200:
 *         description: Detalle del referente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Referente'
 *                 - type: object
 *                   properties:
 *                     metricas:
 *                       type: object
 *                       properties:
 *                         total_referidos:
 *                           type: integer
 *                         referidos_activos:
 *                           type: integer
 *       404:
 *         description: Referente no encontrado
 *       500:
 *         description: Error al obtener referente
 */
router.get("/:id", asesorController.obtenerDetalleReferente);

/**
 * @swagger
 * /asesor/referentes/{id}/referidos:
 *   get:
 *     summary: Listar referidos de un referente específico
 *     description: Ver todos los referidos creados por un referente en particular
 *     tags: [Asesor - Referentes]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del referente
 *     responses:
 *       200:
 *         description: Lista de referidos del referente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referido'
 *       500:
 *         description: Error al listar referidos
 */
router.get("/:id/referidos", asesorController.listarReferidosPorReferente);

/**
 * @swagger
 * /asesor/referentes/estadisticas/mis-metricas:
 *   get:
 *     summary: Obtener estadísticas del asesor autenticado
 *     description: |
 *       Métricas personales del asesor de ventas:
 *       - Total de referidos convertidos
 *       - Comisiones generadas (para la empresa)
 *       - Conversiones de los últimos 30 días
 *     tags: [Asesor - Referentes]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del asesor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referidos_convertidos_total:
 *                   type: integer
 *                   example: 15
 *                   description: Total de referidos que el asesor ha convertido
 *                 comisiones_generadas_total:
 *                   type: number
 *                   example: 435000
 *                   description: Monto total de comisiones generadas por las ventas del asesor
 *                 conversiones_ultimos_30_dias:
 *                   type: integer
 *                   example: 5
 *                   description: Conversiones realizadas en el último mes
 *       500:
 *         description: Error al obtener estadísticas
 */
router.get("/estadisticas/mis-metricas", asesorController.obtenerMisEstadisticas);

export default router;