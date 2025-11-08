import { Router } from "express";
import insigniaController from "../../controllers/admin/insignia.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /insignias:
 *   get:
 *     summary: Listar todas las insignias
 *     description: Obtener lista de insignias/logros disponibles en el sistema
 *     tags: [Insignias]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activa, inactiva]
 *         description: Filtrar por estado
 *       - in: query
 *         name: rareza
 *         schema:
 *           type: string
 *           enum: [comun, rara, epica, legendaria]
 *         description: Filtrar por rareza
 *     responses:
 *       200:
 *         description: Lista de insignias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insignia'
 *       500:
 *         description: Error al listar insignias
 */
router.get("/", insigniaController.listarInsignias);

/**
 * @swagger
 * /insignias/mis-insignias:
 *   get:
 *     summary: Obtener mis insignias (Referente)
 *     description: Ver las insignias obtenidas por el referente autenticado
 *     tags: [Insignias]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de insignias del referente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   insignia:
 *                     $ref: '#/components/schemas/Insignia'
 *                   fecha_obtencion:
 *                     type: string
 *                     format: date-time
 *                   notificado:
 *                     type: boolean
 *       403:
 *         description: Requiere rol de referente
 *       500:
 *         description: Error al obtener insignias
 */
router.get(
  "/mis-insignias",
  [authJwt.verifyToken, authJwt.isReferente],
  insigniaController.obtenerMisInsignias
);

/**
 * @swagger
 * /insignias/referente/{id}:
 *   get:
 *     summary: Obtener insignias de un referente específico
 *     description: Ver las insignias obtenidas por cualquier referente
 *     tags: [Insignias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del referente
 *     responses:
 *       200:
 *         description: Lista de insignias del referente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   insignia:
 *                     $ref: '#/components/schemas/Insignia'
 *                   fecha_obtencion:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error al obtener insignias
 */
router.get("/referente/:id", insigniaController.obtenerInsigniasReferente);

/**
 * @swagger
 * /insignias/{id}:
 *   get:
 *     summary: Obtener una insignia por ID
 *     description: Ver detalles de una insignia específica con estadísticas de cuántos referentes la tienen
 *     tags: [Insignias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la insignia
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Insignia'
 *                 - type: object
 *                   properties:
 *                     estadisticas:
 *                       type: object
 *                       properties:
 *                         total_referentes:
 *                           type: integer
 *                           example: 5
 *       404:
 *         description: Insignia no encontrada
 *       500:
 *         description: Error al obtener insignia
 */
router.get("/:id", insigniaController.obtenerInsignia);

/**
 * @swagger
 * /insignias:
 *   post:
 *     summary: Crear una nueva insignia
 *     description: Crear una insignia/logro para el sistema de gamificación
 *     tags: [Insignias]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsigniaCreateRequest'
 *     responses:
 *       201:
 *         description: Insignia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insignia creada exitosamente
 *                 insignia:
 *                   $ref: '#/components/schemas/Insignia'
 *       400:
 *         description: Datos inválidos o insignia ya existe
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al crear insignia
 */
router.post(
  "/",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  insigniaController.crearInsignia
);

/**
 * @swagger
 * /insignias/{id}/asignar:
 *   post:
 *     summary: Asignar insignia a un referente
 *     description: Asignar manualmente una insignia a un referente específico
 *     tags: [Insignias]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la insignia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_referente
 *             properties:
 *               id_referente:
 *                 type: integer
 *                 example: 1
 *                 description: ID del referente que recibirá la insignia
 *     responses:
 *       200:
 *         description: Insignia asignada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insignia asignada exitosamente
 *                 asignacion:
 *                   type: object
 *       400:
 *         description: El referente ya tiene esta insignia
 *       404:
 *         description: Insignia o referente no encontrado
 *       500:
 *         description: Error al asignar insignia
 */
router.post(
  "/:id/asignar",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  insigniaController.asignarInsignia
);

/**
 * @swagger
 * /insignias/{id}:
 *   put:
 *     summary: Actualizar una insignia
 *     description: Modificar parámetros de una insignia existente
 *     tags: [Insignias]
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
 *               nombre_insignia:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               icono_insignia:
 *                 type: string
 *               color_insignia:
 *                 type: string
 *               criterio_obtencion:
 *                 type: string
 *               rareza:
 *                 type: string
 *                 enum: [comun, rara, epica, legendaria]
 *               estado:
 *                 type: string
 *                 enum: [activa, inactiva]
 *     responses:
 *       200:
 *         description: Insignia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 insignia:
 *                   $ref: '#/components/schemas/Insignia'
 *       404:
 *         description: Insignia no encontrada
 *       500:
 *         description: Error al actualizar insignia
 */
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  insigniaController.actualizarInsignia
);

/**
 * @swagger
 * /insignias/{id}:
 *   delete:
 *     summary: Desactivar una insignia
 *     description: Cambiar el estado de la insignia a "inactiva" (no elimina el registro)
 *     tags: [Insignias]
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
 *         description: Insignia desactivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Insignia no encontrada
 *       500:
 *         description: Error al desactivar insignia
 */
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  insigniaController.eliminarInsignia
);

export default router;