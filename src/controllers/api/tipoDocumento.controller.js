import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("tipoDocumento.controller");

export const getTiposDocumento = async (req, res) => {
  try {
    const tipos = await db.tipoDocumento.findAll({
      attributes: ["id_tipo_documento", "codigo_tipo", "nombre_tipo"],
      order: [["id_tipo_documento", "ASC"]],
    });

    logger.info(`Se obtuvieron ${tipos.length} tipos de documento`);

    return res.status(200).json(tipos);
  } catch (error) {
    logger.error("Error al obtener tipos de documento:", error);
    return res.status(500).json({
      message: "Error al obtener tipos de documento",
      error: error.message,
    });
  }
};

export default {
  getTiposDocumento,
};
