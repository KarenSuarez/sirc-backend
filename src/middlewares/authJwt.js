import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";

const Usuario = db.usuario;
const Rol = db.rol;

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No se proporcionó token." });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "No autorizado. Token inválido." });
    }
    req.userId = decoded.id; // Guardamos el id del usuario en la request
    next();
  });
};

/**
 * Middleware genérico para validar si el usuario tiene un rol específico
 * @param {string} roleName - Nombre del rol a verificar
 */
const hasRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const usuario = await Usuario.findByPk(req.userId, {
        include: [{ model: Rol, as: "roles" }]
      });

      if (!usuario) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      const roles = usuario.roles.map(r => r.nombre_rol.toLowerCase());

      if (roles.includes(roleName.toLowerCase())) {
        return next();
      }

      return res.status(403).send({ message: `Requiere rol de ${roleName}.` });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
};

export default {
  verifyToken,
  hasRole
};
