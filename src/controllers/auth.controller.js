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
 *     LogoutByIDRequest:
 *       type: object
 *       properties:
 *         numero_documento_identidad:
 *           type: string
 *           description: Número de documento de identidad del usuario
 *           example: "1"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema. Limitado a 3 registros por hora por IP.
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
 *       429:
 *         description: Demasiados intentos de registro
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
 *     description: Inicia sesión de usuario. Limitado a 5 intentos cada 15 minutos por IP.
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
 *       429:
 *         description: Demasiados intentos de login
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
    // Log del intento fallido para análisis de seguridad
    console.warn(`[AUTH] Login fallido desde IP: ${req.ip} - ${error.message}`);
    res.status(401).json({ message: error.message });
  }
};
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra la sesión activa del usuario
 *     description: Cierra la sesión del usuario autenticado. Limitado a 10 intentos cada 5 minutos.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       401:
 *         description: Token inválido o sesión no encontrada
 *       429:
 *         description: Demasiadas solicitudes de logout
 *       500:
 *         description: Error del servidor
 */
const logout = async (req, res) => {
  console.log(`[LOGOUT] TOKEN: ${req.headers["x-access-token"]}`);
  const token = req.headers["x-access-token"];
  const tokenDecoded = jwt.decode(token);
  const numero_documento_identidad = tokenDecoded.documento_id;
  //console.log("token decoded in logout: ", tokenDecoded);

  try {
    await authService.logoutSession(numero_documento_identidad, token);
    res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /auth/logoutByID:
 *   post:
 *     summary: Cierra todas las sesiones activas de un usuario por su ID
 *     description: Cierra todas las sesiones del usuario especificado. Limitado a 10 intentos cada 5 minutos.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LogoutByIDRequest"
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       429:
 *         description: Demasiadas solicitudes
 *       500:
 *         description: Error al cerrar las sesiones
 */
const logoutByID = async (req, res) => {
  const numero_documento_identidad = req.body.numero_documento_identidad; 
  try {
    const itWorks = await authService.logoutAllSessionForId(numero_documento_identidad)
    if(itWorks) res.status(200).json({message: "Logout exitoso"});
    else res.status(500).json({message: "Logout activo en otras sesiones"});
  } catch (error) {
    res.status(500).json({message:error.message});
  } 
}
export default {
  register,
  checkDuplicateEmailOrDocument,
  login,
  logout,
  logoutByID
};
