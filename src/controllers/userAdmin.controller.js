import userServices from "../services/user.service.js";
const getProfile = (req, res) => {
  res.status(200).send({
    message: " Perfil de usuario autenticado.",
    userId: req.userId,
  });
};

const adminBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Administradores.",
  });
};

/**
 * @swagger
 * /user/admin/showLiveSessions:
 *   get:
 *     summary: Lista todas las sesiones activas
 *     description: Obtiene todas las sesiones activas (donde `fecha_fin` es `null`) de la base de datos.
 *     tags:
 *       - Sesiones
 *     responses:
 *       200:
 *         description: Lista de sesiones activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la sesión.
 *                   usuario_id:
 *                     type: string
 *                     description: ID del usuario asociado a la sesión.
 *                   fecha_inicio:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de inicio de la sesión.
 *                   fecha_fin:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de fin de la sesión (null si está activa).
 *                   token:
 *                     type: string
 *                     description: Token asociado a la sesión.
 *       500:
 *         description: Error interno del servidor.
 */
const showLiveSessions = async (req, res) => {
  try {
    const sessions = await userServices.getLiveSessions();
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
/**
 * @swagger
 * /user/admin/showAllSessions:
 *   get:
 *     summary: Lista todas las sesiones
 *     description: Obtiene todas las sesiones de la base de datos, tanto activas como inactivas.
 *     tags:
 *       - Sesiones
 *     responses:
 *       200:
 *         description: Lista de sesiones activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la sesión.
 *                   usuario_id:
 *                     type: string
 *                     description: ID del usuario asociado a la sesión.
 *                   fecha_inicio:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de inicio de la sesión.
 *                   fecha_fin:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de fin de la sesión (null si está activa).
 *                   token:
 *                     type: string
 *                     description: Token asociado a la sesión.
 *       500:
 *         description: Error interno del servidor.
 */
const showAllSessions = async (req, res) => {
  try {
    const sessions = await userServices.getAllSessions();
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const asesorBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Asesores Internos.",
  });
};

const gerenteBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Gerentes de Ventas.",
  });
};

export default {
  getProfile,
  adminBoard,
  asesorBoard,
  gerenteBoard,
  showLiveSessions,
  showAllSessions
};
