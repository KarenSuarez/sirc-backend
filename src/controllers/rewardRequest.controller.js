import rewardRequestService from "../services/rewardRequest.service.js";

/**
 * @swagger
 * tags:
 *   name: Solicitudes de Recompensa
 *   description: Endpoints para gestionar solicitudes de retiro de recompensas
 */

/**
 * @swagger
 * /solicitudes/solicitar:
 *   post:
 *     summary: Crear una nueva solicitud de recompensa
 *     description: Crea una solicitud de retiro de recompensa para el referente autenticado.
 *     tags: [Solicitudes de Recompensa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor_retirar:
 *                 type: number
 *                 format: decimal
 *                 example: 50000.00
 *               tipo_solicitud:
 *                 type: string
 *                 enum: [Transferencia Bancaria, Bono de Descuento en Plan]
 *                 example: "Transferencia Bancaria"
 *               tipo_banco:
 *                 type: string
 *                 example: "Bancolombia"
 *               numero_cuenta:
 *                 type: string
 *                 example: "0123456789"
 *             required:
 *               - valor_retirar
 *               - tipo_solicitud
 *               - tipo_banco
 *               - numero_cuenta
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudRecompensa'
 *       400:
 *         description: Faltan datos obligatorios o error de validación.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Obtener todas las solicitudes de recompensa
 *     description: Retorna todas las solicitudes registradas. Solo para contadores.
 *     tags: [Solicitudes de Recompensa]
 *     responses:
 *       200:
 *         description: Lista de solicitudes obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SolicitudRecompensa'
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * /solicitudes/mis-solicitudes:
 *   get:
 *     summary: Obtener solicitudes del referente autenticado
 *     description: Retorna las solicitudes realizadas por el referente según su documento de identidad autenticado.
 *     tags: [Solicitudes de Recompensa]
 *     responses:
 *       200:
 *         description: Lista de solicitudes del referente autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SolicitudRecompensa'
 *       500:
 *         description: Error interno del servidor.
 */




const crearSolicitud = async (req, res) => {
  try {
    const documento_referente = req.numero_documento_identidad;
    const { valor_retirar, tipo_solicitud, tipo_banco, numero_cuenta } = req.body;

    if (!valor_retirar || !tipo_solicitud || !tipo_banco || !numero_cuenta) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const solicitud = await rewardRequestService.crearSolicitud({
      documento_referente,
      valor_retirar,
      tipo_solicitud,
      tipo_banco,
      numero_cuenta
    });

    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const obtenerTodasLasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await rewardRequestService.obtenerSolicitudes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const obtenerSolicitudesReferente = async (req, res) => {
  try {
    const documento_referente = req.numero_documento_identidad;
    const solicitudes = await rewardRequestService.obtenerSolicitudesPorReferente(documento_referente);
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  crearSolicitud,
  obtenerTodasLasSolicitudes,
  obtenerSolicitudesReferente,
};
