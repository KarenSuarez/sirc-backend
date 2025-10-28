import jwt from "jsonwebtoken";
import authService from "../services/auth.service.js";

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
 *           description: Token JWT para autenticación
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1X2lkIjoiMTIzNDU2IiwicmxzX2lkIjpbMSwyXSwiaWF0IjoxNjY2NjY2NjY2LCJleHAiOjE2NjY2NzAyNjZ9.abc123def456ghi789jkl"
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

/** Middleware para verificar duplicados */
const checkDuplicateEmailOrDocument = async (req, res, next) => {
  const { correo_electronico, numero_documento_identidad } = req.body;
  try {
    let user = await authService.findByCorreo(correo_electronico);
    if (user) {
      return res
        .status(400)
        .send({ message: "Error: El correo electrónico ya está en uso." });
    }
    user = await authService.findByDocumento(numero_documento_identidad);
    if (user) {
      return res
        .status(400)
        .send({ message: "Error: El número de documento ya está registrado." });
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
    const deviceInfo = req.headers["user-agent"] || "Unknown device";
    const datosLogin = {
      ipAddress,
      deviceInfo,
    };
    const data = await authService.loginUser(
      numero_documento_identidad,
      password,
      datosLogin,
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
/**
 * @swagger
 * /auth/logout:
 */
const logout = async (req, res) => {
  console.log(req.headers["x-access-token"]);
  const token = req.headers["x-access-token"];
  const tokenDecoded = jwt.decode(token);
  const numero_documento_identidad = tokenDecoded.documento_identidad;
  console.log("token decoded in logout: ", tokenDecoded);

  try {
    await authService.logoutSession(numero_documento_identidad, token);
    res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default {
  register,
  checkDuplicateEmailOrDocument,
  login,
  logout,
};
