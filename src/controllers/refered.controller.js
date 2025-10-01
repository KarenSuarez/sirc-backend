import db from "../models/index.js";
import referidoService from "../services/refered.service.js";
const Refered = db.refered;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReferedRequest:
 *       type: object
 *       required:
 *         - referedName
 *         - referedEmail
 *       properties:
 *         referedName:
 *           type: string
 *           description: Nombre completo del referido.
 *           example: "Juan Pérez"
 *         referedEmail:
 *           type: string
 *           description: Correo electrónico único del referido.
 *           example: "juan.perez@example.com"
 *         referedPhone:
 *           type: string
 *           description: Teléfono del referido.
 *           example: "123456789"
 *   responses:
 *     ReferedResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         referedName:
 *           type: string
 *         referedEmail:
 *           type: string
 *         referedPhone:
 *           type: string
 *         status:
 *           type: string
 *         referrerId:
 *           type: integer
 */

/**
 * @swagger
 * /refereds/referir:
 *   post:
 *     summary: Crea un nuevo referido y lo asocia al usuario referente autenticado.
 *     tags:
 *       - Refereds
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReferedRequest'
 *     responses:
 *       201:
 *         description: Referido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReferedResponse'
 *       400:
 *         description: Datos inválidos o referido duplicado.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido. El usuario no tiene el rol 'referente'.
 *       500:
 *         description: Error del servidor.
 */
const createRefered = async (req, res) => {
    try {
        const { referedName, referedEmail, referedPhone } = req.body;
        const referrerId = req.userId; // Asumimos que el ID del usuario viene del middleware de autenticación

        const newRefered = await Refered.create({
            referedName,
            referedEmail,
            referedPhone,
            referrerId, // Sequelize asociará esto a la clave foránea
        });

        res.status(201).json(newRefered);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const checkDuplicateReferedEmail = async (req, res, next) => {
    try {
        const refered = await Refered.findOne({ where: { referedEmail: req.body.referedEmail } });
        if (refered) {
            return res.status(400).send({ message: "Error: El correo electrónico del referido ya está en uso." });
        }
        next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
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

const getByReferrer = async (req, res) => {
  try {
    const referrerId = req.userId;
    const referidos = await referidoService.getReferidosByReferrer(referrerId);
    res.status(200).json(referidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @swagger
 * /referidos/nuevos:
 *   get:
 *     summary: Listado de referidos con estado = 'nuevo'
 *     tags: [Referidos]
 */
const getNuevos = async (req, res) => {
  try {
    const referidos = await referidoService.getReferidosNuevos();
    res.status(200).json(referidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /referidos/{id}/estado:
 *   patch:
 *     summary: Actualiza el estado de un referido
 *     tags: [Referidos]
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
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [nuevo, proceso, convertido]
 */
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const referido = await referidoService.updateEstadoReferido(id, estado);
    res.status(200).json(referido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export default {
    createRefered,
    checkDuplicateReferedEmail,
    getAll,
    getByReferrer,
    getNuevos,
    updateEstado

};
