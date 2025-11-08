import { Router } from "express";
import kpiController from "../../controllers/admin/kpi.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /kpi/general:
 *   get:
 *     summary: Obtener KPIs generales del sistema
 *     description: |
 *       Métricas generales del sistema incluyendo:
 *       - Total de usuarios y referentes
 *       - Total de referidos y conversiones
 *       - Comisiones totales, pendientes y pagadas
 *       - Tasa de conversión
 *     tags: [KPI]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: KPIs generales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KPIGeneralResponse'
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al obtener KPIs
 */
router.get(
  "/general",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  kpiController.obtenerKPIsGenerales
);

/**
 * @swagger
 * /kpi/referentes:
 *   get:
 *     summary: Obtener métricas de referentes
 *     description: |
 *       Métricas específicas de referentes:
 *       - Top referentes por puntos
 *       - Top referentes por comisiones
 *       - Top referentes por referidos convertidos
 *       - Distribución por niveles
 *     tags: [KPI]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de top referentes a mostrar
 *     responses:
 *       200:
 *         description: Métricas de referentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 top_puntos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Referente'
 *                 top_comisiones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Referente'
 *                 top_referidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Referente'
 *                 distribucion_niveles:
 *                   type: array
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al obtener métricas
 */
router.get(
  "/referentes",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  kpiController.obtenerKPIsReferentes
);

/**
 * @swagger
 * /kpi/comisiones:
 *   get:
 *     summary: Obtener KPIs de comisiones
 *     description: |
 *       Métricas de comisiones:
 *       - Distribución por estado
 *       - Distribución por plan
 *       - Comisiones últimos 30 días
 *       - Promedio de comisión
 *     tags: [KPI]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: KPIs de comisiones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 por_estado:
 *                   type: array
 *                 por_plan:
 *                   type: array
 *                 ultimos_30_dias:
 *                   type: number
 *                 promedio_comision:
 *                   type: number
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al obtener KPIs de comisiones
 */
router.get(
  "/comisiones",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  kpiController.obtenerKPIsComisiones
);

/**
 * @swagger
 * /kpi/dashboard:
 *   get:
 *     summary: Obtener dashboard completo de KPIs
 *     description: Retorna todas las métricas en un solo endpoint
 *     tags: [KPI]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Dashboard completo de KPIs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 generales:
 *                   type: object
 *                 referentes:
 *                   type: object
 *                 comisiones:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al obtener dashboard
 */
router.get(
  "/dashboard",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  kpiController.obtenerDashboardKPIs
);

export default router;