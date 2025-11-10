import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("rol.controller");

export const listarRoles = async (req, res) => {
  try {
    const roles = await db.rol.findAll({
      attributes: ["id_rol", "codigo_rol", "nombre_rol", "descripcion"],
      order: [["id_rol", "ASC"]],
    });

    return res.status(200).json(roles);
  } catch (error) {
    logger.error("Error en listarRoles:", error);
    return res.status(500).json({
      message: "Error al listar roles",
      error: error.message,
    });
  }
};

export const obtenerRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await db.rol.findByPk(id, {
      attributes: ["id_rol", "codigo_rol", "nombre_rol", "descripcion"],
    });

    if (!rol) {
      return res.status(404).json({
        message: "Rol no encontrado",
      });
    }

    return res.status(200).json(rol);
  } catch (error) {
    logger.error("Error en obtenerRol:", error);
    return res.status(500).json({
      message: "Error al obtener rol",
      error: error.message,
    });
  }
};

export default {
  listarRoles,
  obtenerRol,
};