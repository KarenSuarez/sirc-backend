import referidoService from "../services/referido.service.js";

/**
 * @swagger
 * /referidos:
 *   post:
 *     summary: Crea un nuevo referido y lo asocia a un referente.
 *     tags:
 *       - Referidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReferidoRequest'
 *     responses:
 *       201:
 *         description: Referido creado exitosamente.
 *       400:
 *         description: Datos inválidos o duplicados.
 *       500:
 *         description: Error del servidor.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReferidoRequest:
 *       type: object
 *       required:
 *         - documento_identidad_referido
 *         - id_tipo_documento
 *         - nombre_referido
 *         - correo_referido
 *         - telefono_referido
 *         - documento_referente
 *       properties:
 *         documento_identidad_referido:
 *           type: string
 *           description: Documento de identidad del referido.
 *           example: "1122334455"
 *         id_tipo_documento:
 *           type: integer
 *           description: Tipo de documento del referido.
 *           example: 1
 *         nombre_referido:
 *           type: string
 *           description: Nombre completo del referido.
 *           example: "Carlos Pérez"
 *         correo_referido:
 *           type: string
 *           description: Correo electrónico único del referido.
 *           example: "carlos@example.com"
 *         telefono_referido:
 *           type: string
 *           description: Teléfono del referido.
 *           example: "3001112233"
 *         empresa_referido:
 *           type: string
 *           description: Empresa asociada al referido (opcional).
 *           example: "TechCorp"
 *         documento_referente:
 *           type: string
 *           description: Documento del referente que lo registró.
 *           example: "1234567890"
 */

const createRefered = async (req, res) => {
  try {
    const {
      documento_identidad_referido,
      nombre_referido,
      correo_referido,
      telefono_referido,
      empresa_referido,
      cargo_referido,
    } = req.body;

    const datosReferido = {
      documento_identidad_referido,
      nombre_referido,
      correo_referido,
      telefono_referido,
      empresa_referido,
      cargo_referido,
    };
    const documentoReferente = req.numero_documento_identidad;
    const newRefered = await referidoService.createRefered(
      datosReferido,
      documentoReferente,
    );
    res.status(201).json(newRefered);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /referidos:
 *   get:
 *     summary: Listado de todos los referidos
 *     tags: [Referidos]
 */
const getAll = async (req, res) => {
  try {
    const referidos = await referidoService.getAllReferidos();
    res.status(200).json(referidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /referidos/mis-referidos:
 *   get:
 *     summary: Listado de todos los referidos del referente autenticado
 *     tags: [Referidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de referidos
 */

const getByReferente = async (req, res) => {
  try {
    const referrerId = req.numero_documento_identidad;
    const referidos = await referidoService.getReferidosByReferrer(referrerId);
    res.status(200).json(referidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /referidos/pendientes:
 *   get:
 *     summary: Listado de referidos con estado = 'pendiente'
 *     tags: [Referidos]
 */
const getEstadoPendiente = async (req, res) => {
  try {
    const referidos = await referidoService.getReferidosEstadoPendiente();
    res.status(200).json(referidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /referidos/{documento_identidad_referido}/estado:
 *   patch:
 *     summary: Actualiza el estado de un referido y, si pasa a "activo", asigna el plan adquirido.
 *     tags: [Referidos]
 *     parameters:
 *       - in: path
 *         name: documento_identidad_referido
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento de identidad del referido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado_referido:
 *                 type: string
 *                 enum: ["pendiente", "contactado", "activo", "inactivo"]
 *                 description: Nuevo estado del referido
 *               id_plan_adquirido:
 *                 type: integer
 *                 description: ID del plan adquirido (solo se requiere si el estado es "activo")
 *             example:
 *               estado_referido: "activo"
 *               id_plan_adquirido: 2
 *     responses:
 *       200:
 *         description: Estado del referido actualizado correctamente.
 *       400:
 *         description: Error en la solicitud o estado inválido.
 *       404:
 *         description: Referido no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

const updateEstado = async (req, res) => {
  try {
    const { documento_identidad_referido } = req.params;
    const { estado_referido, id_plan_adquirido  } = req.body;
    const referido = await referidoService.updateEstadoReferido(
      documento_identidad_referido,
      estado_referido,
      id_plan_adquirido
    );

  
    res.status(200).json(referido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createRefered,
  getAll,
  getByReferente,
  getEstadoPendiente,
  updateEstado,
};
