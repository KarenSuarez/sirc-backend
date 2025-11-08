import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("insignia.controller");

export const listarInsignias = async (req, res) => {
  try {
    const { estado, rareza } = req.query;

    const where = {};
    if (estado) {
      where.estado = estado;
    }
    if (rareza) {
      where.rareza = rareza;
    }

    const insignias = await db.insignia.findAll({
      where,
      order: [
        ["rareza", "DESC"],
        ["nombre_insignia", "ASC"],
      ],
    });

    return res.status(200).json(insignias);
  } catch (error) {
    logger.error("Error en listarInsignias:", error);
    return res.status(500).json({
      message: "Error al listar insignias",
      error: error.message,
    });
  }
};

export const obtenerInsignia = async (req, res) => {
  try {
    const { id } = req.params;

    const insignia = await db.insignia.findByPk(id);

    if (!insignia) {
      return res.status(404).json({
        message: "Insignia no encontrada",
      });
    }

    const totalReferentesConInsignia = await db.insigniaReferente.count({
      where: { id_insignia: id },
    });

    return res.status(200).json({
      ...insignia.toJSON(),
      estadisticas: {
        total_referentes: totalReferentesConInsignia,
      },
    });
  } catch (error) {
    logger.error("Error en obtenerInsignia:", error);
    return res.status(500).json({
      message: "Error al obtener insignia",
      error: error.message,
    });
  }
};

export const crearInsignia = async (req, res) => {
  try {
    const {
      nombre_insignia,
      descripcion,
      icono_insignia,
      color_insignia,
      criterio_obtencion,
      rareza,
    } = req.body;

    if (
      !nombre_insignia ||
      !descripcion ||
      !icono_insignia ||
      !criterio_obtencion
    ) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
      });
    }

    const nuevaInsignia = await db.insignia.create({
      nombre_insignia,
      descripcion,
      icono_insignia,
      color_insignia: color_insignia || "#888888",
      criterio_obtencion,
      rareza: rareza || "comun",
      estado: "activa",
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    logger.info(`Insignia creada: ${nuevaInsignia.nombre_insignia}`);

    return res.status(201).json({
      message: "Insignia creada exitosamente",
      insignia: nuevaInsignia,
    });
  } catch (error) {
    logger.error("Error en crearInsignia:", error);
    return res.status(500).json({
      message: "Error al crear insignia",
      error: error.message,
    });
  }
};

export const actualizarInsignia = async (req, res) => {
  try {
    const { id } = req.params;

    const insignia = await db.insignia.findByPk(id);

    if (!insignia) {
      return res.status(404).json({
        message: "Insignia no encontrada",
      });
    }

    const {
      nombre_insignia,
      descripcion,
      icono_insignia,
      color_insignia,
      criterio_obtencion,
      rareza,
      estado,
    } = req.body;

    await insignia.update({
      nombre_insignia: nombre_insignia || insignia.nombre_insignia,
      descripcion: descripcion || insignia.descripcion,
      icono_insignia: icono_insignia || insignia.icono_insignia,
      color_insignia: color_insignia || insignia.color_insignia,
      criterio_obtencion: criterio_obtencion || insignia.criterio_obtencion,
      rareza: rareza || insignia.rareza,
      estado: estado || insignia.estado,
      actualizado_en: new Date(),
    });

    logger.info(`Insignia actualizada: ${insignia.nombre_insignia}`);

    return res.status(200).json({
      message: "Insignia actualizada exitosamente",
      insignia,
    });
  } catch (error) {
    logger.error("Error en actualizarInsignia:", error);
    return res.status(500).json({
      message: "Error al actualizar insignia",
      error: error.message,
    });
  }
};

export const eliminarInsignia = async (req, res) => {
  try {
    const { id } = req.params;

    const insignia = await db.insignia.findByPk(id);

    if (!insignia) {
      return res.status(404).json({
        message: "Insignia no encontrada",
      });
    }

    await insignia.update({
      estado: "inactiva",
      actualizado_en: new Date(),
    });

    logger.info(`Insignia desactivada: ${insignia.nombre_insignia}`);

    return res.status(200).json({
      message: "Insignia desactivada exitosamente",
    });
  } catch (error) {
    logger.error("Error en eliminarInsignia:", error);
    return res.status(500).json({
      message: "Error al eliminar insignia",
      error: error.message,
    });
  }
};

export const asignarInsignia = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_referente } = req.body;

    if (!id_referente) {
      return res.status(400).json({
        message: "id_referente es requerido",
      });
    }

    const insignia = await db.insignia.findByPk(id);
    if (!insignia) {
      return res.status(404).json({
        message: "Insignia no encontrada",
      });
    }

    const referente = await db.referente.findByPk(id_referente);
    if (!referente) {
      return res.status(404).json({
        message: "Referente no encontrado",
      });
    }

    const yaAsignada = await db.insigniaReferente.findOne({
      where: { id_referente, id_insignia: id },
    });

    if (yaAsignada) {
      return res.status(400).json({
        message: "El referente ya tiene esta insignia",
      });
    }

    const asignacion = await db.insigniaReferente.create({
      id_referente,
      id_insignia: id,
      fecha_obtencion: new Date(),
      notificado: false,
      creado_en: new Date(),
    });

    logger.info(
      `Insignia "${insignia.nombre_insignia}" asignada a referente ${id_referente}`
    );

    return res.status(200).json({
      message: "Insignia asignada exitosamente",
      asignacion,
    });
  } catch (error) {
    logger.error("Error en asignarInsignia:", error);
    return res.status(500).json({
      message: "Error al asignar insignia",
      error: error.message,
    });
  }
};

export const obtenerInsigniasReferente = async (req, res) => {
  try {
    const { id } = req.params;

    const insignias = await db.insigniaReferente.findAll({
      where: { id_referente: id },
      include: [
        {
          model: db.insignia,
          as: "insignia",
        },
      ],
      order: [["fecha_obtencion", "DESC"]],
    });

    return res.status(200).json(insignias);
  } catch (error) {
    logger.error("Error en obtenerInsigniasReferente:", error);
    return res.status(500).json({
      message: "Error al obtener insignias del referente",
      error: error.message,
    });
  }
};

export const obtenerMisInsignias = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const insignias = await db.insigniaReferente.findAll({
      where: { id_referente: id_usuario },
      include: [
        {
          model: db.insignia,
          as: "insignia",
        },
      ],
      order: [["fecha_obtencion", "DESC"]],
    });

    return res.status(200).json(insignias);
  } catch (error) {
    logger.error("Error en obtenerMisInsignias:", error);
    return res.status(500).json({
      message: "Error al obtener tus insignias",
      error: error.message,
    });
  }
};

export default {
  listarInsignias,
  obtenerInsignia,
  crearInsignia,
  actualizarInsignia,
  eliminarInsignia,
  asignarInsignia,
  obtenerInsigniasReferente,
  obtenerMisInsignias,
};
