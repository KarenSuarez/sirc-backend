import authService from "../services/auth.service.js";
import db from "../models/index.js";
const Usuario = db.usuario;

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - correo_electronico
 *         - password
 *         - numero_documento_identidad
 *         - id_tipo_documento
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         correo_electronico:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         numero_documento_identidad:
 *           type: string
 *         id_tipo_documento:
 *           type: integer
 *         telefono:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - numero_documento_identidad
 *         - password
 *       properties:
 *         numero_documento_identidad:
 *           type: string
 *         password:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         numero_documento_identidad:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *         accessToken:
 *           type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Correo o documento duplicado
 *       500:
 *         description: Error del servidor
 */
const register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).send({ message: "¡Usuario registrado exitosamente!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Middleware para verificar duplicados
 */
const checkDuplicateEmailOrDocument = async (req, res, next) => {
  try {
    let user = await Usuario.findOne({ where: { correo_electronico: req.body.correo_electronico } });
    if (user) {
      return res.status(400).send({ message: "Error: El correo electrónico ya está en uso." });
    }

    user = await Usuario.findOne({ where: { numero_documento_identidad: req.body.numero_documento_identidad } });
    if (user) {
      return res.status(400).send({ message: "Error: El número de documento ya está registrado." });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error del servidor
 */
const login = async (req, res) => {
  try {
    const { numero_documento_identidad, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const deviceInfo = req.headers['user-agent'] || 'Unknown device';
    //print all headers
    console.log('Request Headers:', req.headers);
    console.log('IP Address:', ipAddress);
    console.log('Device Info:', deviceInfo);
    const datosLogin = {
      ipAddress,
      deviceInfo
    };
    const data = await authService.loginUser(numero_documento_identidad, password, datosLogin);
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default {
  register,
  checkDuplicateEmailOrDocument,
  login
};
