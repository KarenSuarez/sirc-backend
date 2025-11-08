import { Router } from "express";
import referenteController from "../../controllers/referente/referente.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

router.use([authJwt.verifyToken, authJwt.isReferente]);

/**
 * @swagger
 * /referente/dashboard:
 *   get:
 *     summary: Obtener dashboard completo del referente
 *     description: Retorna saldo, puntos, nivel actual, progreso y estadísticas de referidos
 *     tags: [Referente]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Dashboard del referente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       403:
 *         description: Usuario no es referente o perfil inactivo
 *       500:
 *         description: Error al obtener dashboard
 */
router.get("/dashboard", referenteController.getDashboard);

/**
 * @swagger
 * /referente/perfil:
 *   get:
 *     summary: Obtener perfil del referente
 *     description: Información completa del perfil de referente incluyendo código, tipo y estado
 *     tags: [Referente]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Perfil del referente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referente'
 *       404:
 *         description: Perfil de referente no encontrado
 *       500:
 *         description: Error al obtener perfil
 */
router.get("/perfil", referenteController.getPerfil);

/**
 * @swagger
 * /referente/saldo:
 *   get:
 *     summary: Consultar saldo disponible y retiros
 *     description: Retorna saldo disponible, total de comisiones históricas, total retirado y últimos movimientos
 *     tags: [Referente]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Información de saldo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saldo_disponible:
 *                   type: number
 *                   example: 50000
 *                 total_comisiones_historico:
 *                   type: number
 *                   example: 100000
 *                 total_retirado:
 *                   type: number
 *                   example: 50000
 *                 ultimos_movimientos:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error al consultar saldo
 */
router.get("/saldo", referenteController.getSaldo);

/**
 * @swagger
 * /referente/comisiones:
 *   get:
 *     summary: Historial de comisiones
 *     description: Lista todas las comisiones generadas por el referente con detalles de cada movimiento
 *     tags: [Referente]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, pagada, retirada]
 *         description: Filtrar por estado de comisión
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
 *         description: Historial de comisiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_movimiento:
 *                     type: integer
 *                   monto_comision:
 *                     type: number
 *                   estado_comision:
 *                     type: string
 *                   fecha_movimiento:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error al obtener comisiones
 */
router.get("/comisiones", referenteController.getComisiones);

/**
 * @swagger
 * /referente/nivel:
 *   get:
 *     summary: Consultar nivel actual y progreso
 *     description: Retorna nivel actual, puntos necesarios para siguiente nivel y porcentaje de progreso
 *     tags: [Referente]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Información de nivel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nivel_actual:
 *                   $ref: '#/components/schemas/Nivel'
 *                 puntos_actuales:
 *                   type: integer
 *                   example: 150
 *                 progreso:
 *                   type: object
 *                   properties:
 *                     puntos_faltantes:
 *                       type: integer
 *                       example: 150
 *                     porcentaje_progreso:
 *                       type: number
 *                       example: 50
 *                     siguiente_nivel:
 *                       $ref: '#/components/schemas/Nivel'
 *       500:
 *         description: Error al obtener nivel
 */
router.get("/nivel", referenteController.getNivel);

export default router;