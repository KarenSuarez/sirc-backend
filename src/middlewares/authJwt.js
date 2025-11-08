import jwt from "jsonwebtoken";
import db from "../models/index.js";

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    if (!token) {
      return res.status(403).json({
        message: "No se proporcionó un token de autenticación",
      });
    }

    jwt.verify(
      token,
      process.env.SECRET || "secret-key-default",
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Token inválido o expirado",
          });
        }

        req.userId = decoded.id_usuario;
        req.numero_documento = decoded.numero_documento;
        req.roles = decoded.roles || [];
        req.rls_id = decoded.rls_id || [];

        next();
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error al verificar el token",
      error: error.message,
    });
  }
};

/**
 * Verifica que el usuario tenga un rol específico
 * @param {string|Array} rolesPermitidos - Rol o roles permitidos
 */
const hasRole = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(403).json({
          message: "No se encontró información del usuario",
        });
      }

      const usuario = await db.usuario.findByPk(userId, {
        include: [
          {
            model: db.rol,
            as: "roles",
            attributes: ["id_rol", "nombre_rol", "codigo_rol"],
            through: { attributes: [] },
          },
        ],
      });

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      const rolesUsuario = usuario.roles.map((rol) => rol.nombre_rol);
      const codigosRol = usuario.roles.map((rol) => rol.codigo_rol);

      const tienePermiso = rolesPermitidos.some(
        (rolPermitido) =>
          rolesUsuario.includes(rolPermitido) ||
          codigosRol.includes(rolPermitido.toUpperCase())
      );

      if (!tienePermiso) {
        return res.status(403).json({
          message: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Error al verificar permisos",
        error: error.message,
      });
    }
  };
};

const isAdmin = async (req, res, next) => {
  return hasRole("administrador", "ADMIN")(req, res, next);
};

const isReferente = async (req, res, next) => {
  return hasRole("referente", "REF")(req, res, next);
};

const isGerente = async (req, res, next) => {
  return hasRole("gerente_ventas", "GERENTE")(req, res, next);
};

const isContador = async (req, res, next) => {
  return hasRole("contador", "CONTADOR")(req, res, next);
};

const isAsesor = async (req, res, next) => {
  return hasRole("asesor_ventas", "ASESOR")(req, res, next);
};

/**
 * Verifica que el usuario sea el dueño del recurso o admin
 * @param {string} paramName - Nombre del parámetro que contiene el ID del recurso
 */
const isOwnerOrAdmin = (paramName = "id") => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;
      const resourceId = parseInt(req.params[paramName]);

      const usuario = await db.usuario.findByPk(userId, {
        include: [
          {
            model: db.rol,
            as: "roles",
            attributes: ["nombre_rol", "codigo_rol"],
            through: { attributes: [] },
          },
        ],
      });

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      const esAdmin = usuario.roles.some(
        (rol) =>
          rol.nombre_rol === "administrador" || rol.codigo_rol === "ADMIN"
      );

      if (esAdmin || userId === resourceId) {
        return next();
      }

      return res.status(403).json({
        message: "No tienes permiso para acceder a este recurso",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al verificar permisos",
        error: error.message,
      });
    }
  };
};

const hasActiveReferenteProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const referente = await db.referente.findByPk(userId);

    if (!referente) {
      return res.status(403).json({
        message: "No tienes un perfil de referente",
      });
    }

    if (referente.estado_referente !== "activo") {
      return res.status(403).json({
        message: `Tu perfil de referente está ${referente.estado_referente}`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error al verificar perfil de referente",
      error: error.message,
    });
  }
};

const authJwt = {
  verifyToken,
  hasRole,
  isAdmin,
  isReferente,
  isGerente,
  isContador,
  isAsesor,
  isOwnerOrAdmin,
  hasActiveReferenteProfile,
};

export default authJwt;
