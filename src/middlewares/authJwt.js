import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";
import authService from "../services/auth.service.js";
import rateLimit from 'express-rate-limit';

const Usuario = db.usuario;
const Rol = db.rol;
const HistorialSesion = db.historialSesion;

// Rate limiter para intentos de verificación de token
const tokenVerificationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 verificaciones por minuto
  message: {
    message: 'Demasiadas solicitudes de verificación. Por favor espere un momento.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No aplicar rate limiting si el token es válido
    const token = req.headers["x-access-token"];
    if (!token) return false;
    
    try {
      jwt.verify(token, config.secret);
      return true; // Skip rate limiting para tokens válidos
    } catch (error) {
      return false; // Aplicar rate limiting para tokens inválidos
    }
  }
});

/** Middleware para verificar el token JWT */
const verifyToken = [tokenVerificationLimiter, (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No se proporcionó token." });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "No autorizado. Token inválido." });
    }
    req.numero_documento_identidad = decoded.documento_id;
    next();
  });
}];

/** Middleware para verificar si el usuario es 'referente' */
const isReferente = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.numero_documento_identidad);
    const roles = await usuario.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].nombre_rol === "referente") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Requiere rol de Referente." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Middleware genérico para validar si el usuario tiene un rol específico
 *
 * @param {string} roleName - Nombre del rol a verificar
 */
const hasRole = (roleName) => {
  return async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send({ message: "No se proporcionó token." });
    }

    try {
      // Decodificar el token JWT
      const decoded = jwt.verify(token, config.secret);
      const documentoIdentidad = decoded.documento_id; // Extraer el documento_identidad del token
      
      // Buscar el usuario en la base de datos
      const usuario = await Usuario.findOne({
        where: { numero_documento_identidad: documentoIdentidad },
        include: [{ model: Rol, as: "roles" }],
      });

      if (!usuario) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      // Verificar si el usuario tiene el rol requerido
      const roles = usuario.roles.map((r) => r.nombre_rol.toLowerCase());
      if (roles.includes(roleName.toLowerCase())) {
        return next();
      }

      return res.status(403).send({ message: `Requiere rol de ${roleName}.` });
    } catch (error) {
      //return res.status(401).send({ message: "No autorizado. Token inválido." });
      return res.status(500).send({ message: error.message });
    }
  };
};
/**
 * @swagger
 * /ruta/protegida:  // Cambia esto por la ruta correspondiente
 *   get:
 *     summary: Verifica si el token de sesión está activo.
 *     description: Middleware que valida si el token de sesión proporcionado en los headers está activo y asociado a una sesión válida.
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []  // Define el esquema de autenticación si usas JWT
 *     responses:
 *       200:
 *         description: Token válido y sesión activa.
 *       401:
 *         description: Token de sesión no activo o inválido.
 *       500:
 *         description: Error interno del servidor.
 */
const isAliveToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, config.secret);
    const documentoIdentidad = decoded.documento_id; // Extraer el documento_identidad del token
    const lastSegment = authService.lastValueToken(token);

    const sessionsOfUser = await HistorialSesion.findAll({
      where: {
        usuario_id: documentoIdentidad,
        fecha_fin: null,
        token: lastSegment,
      },
    });
    console.log(
      "Sesiones activas del usuario:",
      sessionsOfUser.map((session) => session.toJSON()),
    );
    if (!sessionsOfUser || sessionsOfUser.length === 0) {
      return res.status(401).send({ message: "Token de sesión no activo." });
    }
    return next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export default {
  verifyToken,
  isReferente,
  hasRole,
  isAliveToken
};
