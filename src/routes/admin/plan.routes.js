import { Router } from "express";
import planController from "../../controllers/admin/plan.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /planes:
 *   get:
 *     summary: Listar todos los planes
 *     description: Obtener lista de planes comerciales disponibles
 *     tags: [Planes]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, inactivo]
 *         description: Filtrar por estado del plan
 *     responses:
 *       200:
 *         description: Lista de planes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Error al listar planes
 */
router.get("/", planController.listarPlanes);

/**
 * @swagger
 * /planes/{id}:
 *   get:
 *     summary: Obtener un plan por ID
 *     description: Ver detalles completos de un plan específico
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plan
 *     responses:
 *       200:
 *         description: Detalle del plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error al obtener plan
 */
router.get("/:id", planController.obtenerPlan);

/**
 * @swagger
 * /planes:
 *   post:
 *     summary: Crear un nuevo plan
 *     description: Crear un plan comercial con sus parámetros de comisión y puntos
 *     tags: [Planes]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_plan
 *               - precio_actual
 *               - porcentaje_comision_base
 *               - puntos_otorgados
 *             properties:
 *               nombre_plan:
 *                 type: string
 *                 example: Plan Premium
 *               descripcion:
 *                 type: string
 *                 example: Plan completo para empresas en crecimiento
 *               precio_actual:
 *                 type: number
 *                 example: 490000
 *               porcentaje_comision_base:
 *                 type: number
 *                 example: 15
 *               puntos_otorgados:
 *                 type: integer
 *                 example: 100
 *               estado_plan:
 *                 type: string
 *                 enum: [activo, inactivo]
 *                 default: activo
 *               icono_plan:
 *                 type: string
 *                 example: package-premium
 *               color_plan:
 *                 type: string
 *                 example: "#F5A623"
 *     responses:
 *       201:
 *         description: Plan creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan creado exitosamente
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al crear plan
 */
router.post(
  "/",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  planController.crearPlan
);

/**
 * @swagger
 * /planes/{id}:
 *   put:
 *     summary: Actualizar un plan existente
 *     description: Modificar parámetros de un plan comercial
 *     tags: [Planes]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_plan:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio_actual:
 *                 type: number
 *               porcentaje_comision_base:
 *                 type: number
 *               puntos_otorgados:
 *                 type: integer
 *               estado_plan:
 *                 type: string
 *               icono_plan:
 *                 type: string
 *               color_plan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error al actualizar plan
 */
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  planController.actualizarPlan
);

/**
 * @swagger
 * /planes/{id}:
 *   delete:
 *     summary: Desactivar un plan
 *     description: Cambiar el estado del plan a "inactivo" (no elimina el registro)
 *     tags: [Planes]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan desactivado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error al desactivar plan
 */
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  planController.eliminarPlan
);

export default router;