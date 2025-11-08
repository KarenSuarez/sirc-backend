import { Router } from "express";
import solicitudController from "../../controllers/referente/solicitud.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

router.use([authJwt.verifyToken]);

/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Crear una solicitud de retiro
 *     description: El referente solicita un retiro de su saldo disponible o aplicar un bono de pago
 *     tags: [Solicitudes]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudCreateRequest'
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud creada exitosamente
 *                 solicitud:
 *                   $ref: '#/components/schemas/SolicitudRecompensa'
 *       400:
 *         description: Saldo insuficiente o datos inválidos
 *       500:
 *         description: Error al crear solicitud
 */
router.post("/", [authJwt.isReferente, authJwt.hasActiveReferenteProfile], solicitudController.crearSolicitud);

/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Listar mis solicitudes
 *     description: Lista todas las solicitudes de retiro del referente autenticado
 *     tags: [Solicitudes]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, en_revision, aprobada, rechazada, procesada, pagada]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SolicitudRecompensa'
 *       500:
 *         description: Error al listar solicitudes
 */
router.get("/", [authJwt.isReferente], solicitudController.listarSolicitudes);

/**
 * @swagger
 * /solicitudes/contador/todas:
 *   get:
 *     summary: Listar TODAS las solicitudes (Contador)
 *     description: El contador puede ver todas las solicitudes de todos los referentes para gestionarlas
 *     tags: [Contador]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, en_revision, aprobada, rechazada, procesada, pagada]
 *       - in: query
 *         name: metodo_retiro
 *         schema:
 *           type: string
 *           enum: [retiro, bono_pago]
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
 *         description: Lista de todas las solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       403:
 *         description: Requiere rol de contador o administrador
 *       500:
 *         description: Error al listar solicitudes
 */
router.get("/contador/todas", [authJwt.hasRole("contador", "administrador")], solicitudController.listarTodasLasSolicitudes);

/**
 * @swagger
 * /solicitudes/{id}:
 *   get:
 *     summary: Obtener detalle de una solicitud
 *     description: Ver información completa de una solicitud (referente dueño, contador o admin)
 *     tags: [Solicitudes]
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
 *         description: Detalle de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudRecompensa'
 *       403:
 *         description: No tienes permiso para ver esta solicitud
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error al obtener solicitud
 */
router.get("/:id", solicitudController.getSolicitud);

/**
 * @swagger
 * /solicitudes/{id}/aprobar:
 *   post:
 *     summary: Aprobar solicitud y subir comprobante
 *     description: El contador aprueba la solicitud, procesa el pago y puede subir el comprobante
 *     tags: [Contador]
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
 *             $ref: '#/components/schemas/AprobarSolicitudRequest'
 *     responses:
 *       200:
 *         description: Solicitud aprobada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud aprobada exitosamente
 *                 solicitud:
 *                   $ref: '#/components/schemas/SolicitudRecompensa'
 *       400:
 *         description: Solicitud ya fue procesada
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error al aprobar solicitud
 */
router.post("/:id/aprobar", [authJwt.hasRole("contador", "administrador")], solicitudController.aprobarSolicitud);

/**
 * @swagger
 * /solicitudes/{id}/rechazar:
 *   post:
 *     summary: Rechazar solicitud
 *     description: El contador rechaza la solicitud con observaciones opcionales
 *     tags: [Contador]
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
 *                 example: "Documentación incompleta"
 *     responses:
 *       200:
 *         description: Solicitud rechazada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud rechazada
 *                 solicitud:
 *                   $ref: '#/components/schemas/SolicitudRecompensa'
 *       400:
 *         description: Solicitud ya fue procesada
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error al rechazar solicitud
 */
router.post("/:id/rechazar", [authJwt.hasRole("contador", "administrador")], solicitudController.rechazarSolicitud);

export default router;