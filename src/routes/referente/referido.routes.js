import { Router } from "express";
import referidoController from "../../controllers/referente/referido.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

router.use([authJwt.verifyToken, authJwt.isReferente]);

/**
 * @swagger
 * /referidos:
 *   post:
 *     summary: Crear un nuevo referido
 *     description: El referente crea un nuevo referido con sus datos personales y de contacto
 *     tags: [Referidos]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReferidoCreateRequest'
 *     responses:
 *       201:
 *         description: Referido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Referido creado exitosamente
 *                 referido:
 *                   $ref: '#/components/schemas/Referido'
 *       400:
 *         description: Datos inválidos o referido ya existe
 *       403:
 *         description: Perfil de referente no activo
 *       500:
 *         description: Error al crear referido
 */
router.post("/", [authJwt.hasActiveReferenteProfile], referidoController.crearReferido);

/**
 * @swagger
 * /referidos:
 *   get:
 *     summary: Listar mis referidos
 *     description: Lista todos los referidos creados por el referente autenticado
 *     tags: [Referidos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, contactado, activo, no_interesado, inactivo]
 *         description: Filtrar por estado del referido
 *     responses:
 *       200:
 *         description: Lista de referidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referido'
 *       500:
 *         description: Error al listar referidos
 */
router.get("/", referidoController.listarReferidos);

/**
 * @swagger
 * /referidos/{id}:
 *   get:
 *     summary: Obtener detalle de un referido
 *     description: Ver información completa de un referido específico (solo si es propio)
 *     tags: [Referidos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del referido
 *     responses:
 *       200:
 *         description: Detalle del referido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referido'
 *       403:
 *         description: No tienes permiso para ver este referido
 *       404:
 *         description: Referido no encontrado
 *       500:
 *         description: Error al obtener referido
 */
router.get("/:id", referidoController.getReferido);

/**
 * @swagger
 * /referidos/{id}:
 *   put:
 *     summary: Actualizar un referido
 *     description: Actualizar información de un referido (solo si es propio)
 *     tags: [Referidos]
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
 *               nombre_referido:
 *                 type: string
 *               apellido_referido:
 *                 type: string
 *               correo_referido:
 *                 type: string
 *               telefono_referido:
 *                 type: string
 *               empresa_referido:
 *                 type: string
 *               cargo_referido:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referido actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 referido:
 *                   $ref: '#/components/schemas/Referido'
 *       403:
 *         description: No tienes permiso para modificar este referido
 *       404:
 *         description: Referido no encontrado
 *       500:
 *         description: Error al actualizar referido
 */
router.put("/:id", referidoController.actualizarReferido);

export default router;