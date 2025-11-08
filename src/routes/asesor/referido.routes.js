import { Router } from "express";
import asesorController from "../../controllers/asesor/asesor.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

router.use([authJwt.verifyToken, authJwt.hasRole("asesor_ventas", "administrador")]);

/**
 * @swagger
 * /asesor/referidos:
 *   get:
 *     summary: Listar TODOS los referidos del sistema
 *     description: El asesor puede ver todos los referidos de todos los referentes para gestionarlos
 *     tags: [Asesor - Referidos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, contactado, activo, no_interesado, inactivo]
 *         description: Filtrar por estado del referido
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
 *         description: Lista de todos los referidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       403:
 *         description: Requiere rol de asesor de ventas
 *       500:
 *         description: Error al listar referidos
 */
router.get("/", asesorController.listarTodosLosReferidos);

/**
 * @swagger
 * /asesor/referidos/{id}:
 *   get:
 *     summary: Obtener detalle de cualquier referido
 *     description: Ver información completa de cualquier referido del sistema
 *     tags: [Asesor - Referidos]
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
 *       404:
 *         description: Referido no encontrado
 *       500:
 *         description: Error al obtener referido
 */
router.get("/:id", asesorController.obtenerDetalleReferido);

/**
 * @swagger
 * /asesor/referidos/{id}/convertir:
 *   post:
 *     summary: Convertir un referido (vender plan)
 *     description: |
 *       El asesor convierte al referido vendiendo un plan. Esta acción:
 *       - Cambia el estado del referido a "activo"
 *       - Registra el plan adquirido
 *       - Procesa automáticamente la comisión para el referente
 *       - Registra al asesor como vendedor (tracking)
 *     tags: [Asesor - Referidos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del referido a convertir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConvertirReferidoRequest'
 *     responses:
 *       200:
 *         description: Referido convertido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Referido convertido y comisión procesada exitosamente
 *                 referido:
 *                   $ref: '#/components/schemas/Referido'
 *                 comision:
 *                   type: object
 *                   properties:
 *                     precio_plan_momento:
 *                       type: number
 *                       example: 290000
 *                     monto_comision:
 *                       type: number
 *                       example: 29000
 *                     puntos_otorgados:
 *                       type: integer
 *                       example: 50
 *                 asesor_vendedor:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       example: 2
 *                     mensaje:
 *                       type: string
 *                       example: Venta registrada a tu nombre
 *       400:
 *         description: Referido ya fue convertido o datos inválidos
 *       404:
 *         description: Referido o plan no encontrado
 *       500:
 *         description: Error al convertir referido
 */
router.post("/:id/convertir", asesorController.convertirReferidoPorAsesor);

/**
 * @swagger
 * /asesor/referidos/{id}/actualizar-estado:
 *   put:
 *     summary: Actualizar estado de un referido
 *     description: El asesor puede cambiar el estado del referido (pendiente, contactado, no_interesado, etc.)
 *     tags: [Asesor - Referidos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado_referido
 *             properties:
 *               estado_referido:
 *                 type: string
 *                 enum: [pendiente, contactado, activo, no_interesado, inactivo]
 *                 example: contactado
 *               observaciones:
 *                 type: string
 *                 example: Cliente interesado, enviar cotización
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado actualizado exitosamente
 *                 referido:
 *                   $ref: '#/components/schemas/Referido'
 *       404:
 *         description: Referido no encontrado
 *       500:
 *         description: Error al actualizar estado
 */
router.put("/:id/actualizar-estado", asesorController.actualizarEstadoReferido);

/**
 * @swagger
 * /asesor/referidos/{id}:
 *   put:
 *     summary: Actualizar información completa del referido
 *     description: Editar datos personales y profesionales del referido
 *     tags: [Asesor - Referidos]
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
 *       404:
 *         description: Referido no encontrado
 *       500:
 *         description: Error al actualizar referido
 */
router.put("/:id", asesorController.actualizarInformacionReferido);

/**
 * @swagger
 * /asesor/referidos/{id}/contactar:
 *   post:
 *     summary: Registrar primer contacto con referido
 *     description: Marca el referido como "contactado" y registra la fecha y observaciones del primer contacto
 *     tags: [Asesor - Referidos]
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
 *               observaciones:
 *                 type: string
 *                 example: Primera llamada realizada, cliente interesado
 *     responses:
 *       200:
 *         description: Contacto registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contacto registrado exitosamente
 *                 referido:
 *                   $ref: '#/components/schemas/Referido'
 *       404:
 *         description: Referido no encontrado
 *       500:
 *         description: Error al registrar contacto
 */
router.post("/:id/contactar", asesorController.registrarPrimerContacto);

export default router;