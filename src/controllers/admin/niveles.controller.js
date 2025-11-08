import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("niveles.controller");

export const listarNiveles = async (req, res) => {
  try {
    const niveles = await db.nivel.findAll({
      order: [["orden_nivel", "ASC"]],
    });

    return res.status(200).json(niveles);
  } catch (error) {
    logger.error("Error en listarNiveles:", error);
    return res.status(500).json({
      message: "Error al listar niveles",
      error: error.message,
    });
  }
};

export const listarNivelesActivos = async (req, res) => {
  try {
    const niveles = await db.nivel.findAll({
      order: [["orden_nivel", "ASC"]],
    });

    return res.status(200).json(niveles);
  } catch (error) {
    logger.error("Error en listarNivelesActivos:", error);
    return res.status(500).json({
      message: "Error al listar niveles activos",
      error: error.message,
    });
  }
};

export const obtenerNivel = async (req, res) => {
  try {
    const { id } = req.params;

    const nivel = await db.nivel.findByPk(id);

    if (!nivel) {
      return res.status(404).json({
        message: "Nivel no encontrado",
      });
    }

    return res.status(200).json(nivel);
  } catch (error) {
    logger.error("Error en obtenerNivel:", error);
    return res.status(500).json({
      message: "Error al obtener nivel",
      error: error.message,
    });
  }
};

export const crearNivel = async (req, res) => {
  try {
    const {
      nombre_nivel,
      orden_nivel,
      puntos_minimos,
      puntos_maximos,
      porcentaje_comision_extra,
      icono_nivel,
      color_nivel,
      beneficios_nivel,
      descripcion,
    } = req.body;

    if (
      !nombre_nivel ||
      !orden_nivel ||
      puntos_minimos === undefined ||
      puntos_maximos === undefined
    ) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
      });
    }

    if (puntos_minimos >= puntos_maximos) {
      return res.status(400).json({
        message: "puntos_minimos debe ser menor que puntos_maximos",
      });
    }

    const nuevoNivel = await db.nivel.create({
      nombre_nivel,
      orden_nivel: parseInt(orden_nivel),
      puntos_minimos: parseInt(puntos_minimos),
      puntos_maximos: parseInt(puntos_maximos),
      porcentaje_comision_extra: porcentaje_comision_extra
        ? parseFloat(porcentaje_comision_extra)
        : 0.0,
      icono_nivel: icono_nivel || null,
      color_nivel: color_nivel || null,
      beneficios_nivel: beneficios_nivel || null,
      descripcion: descripcion || null,
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    logger.info(`Nivel creado: ${nuevoNivel.nombre_nivel}`);

    return res.status(201).json({
      message: "Nivel creado exitosamente",
      nivel: nuevoNivel,
    });
  } catch (error) {
    logger.error("Error en crearNivel:", error);
    return res.status(500).json({
      message: "Error al crear nivel",
      error: error.message,
    });
  }
};

export const actualizarNivel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_nivel,
      orden_nivel,
      puntos_minimos,
      puntos_maximos,
      porcentaje_comision_extra,
      icono_nivel,
      color_nivel,
      beneficios_nivel,
      descripcion,
    } = req.body;

    const nivel = await db.nivel.findByPk(id);

    if (!nivel) {
      return res.status(404).json({
        message: "Nivel no encontrado",
      });
    }

    const nuevos_min =
      puntos_minimos !== undefined
        ? parseInt(puntos_minimos)
        : nivel.puntos_minimos;
    const nuevos_max =
      puntos_maximos !== undefined
        ? parseInt(puntos_maximos)
        : nivel.puntos_maximos;

    if (nuevos_min >= nuevos_max) {
      return res.status(400).json({
        message: "puntos_minimos debe ser menor que puntos_maximos",
      });
    }

    await nivel.update({
      nombre_nivel: nombre_nivel || nivel.nombre_nivel,
      orden_nivel:
        orden_nivel !== undefined ? parseInt(orden_nivel) : nivel.orden_nivel,
      puntos_minimos: nuevos_min,
      puntos_maximos: nuevos_max,
      porcentaje_comision_extra:
        porcentaje_comision_extra !== undefined
          ? parseFloat(porcentaje_comision_extra)
          : nivel.porcentaje_comision_extra,
      icono_nivel: icono_nivel !== undefined ? icono_nivel : nivel.icono_nivel,
      color_nivel: color_nivel !== undefined ? color_nivel : nivel.color_nivel,
      beneficios_nivel:
        beneficios_nivel !== undefined
          ? beneficios_nivel
          : nivel.beneficios_nivel,
      descripcion: descripcion !== undefined ? descripcion : nivel.descripcion,
      actualizado_en: new Date(),
    });

    logger.info(`Nivel actualizado: ${nivel.nombre_nivel}`);

    return res.status(200).json({
      message: "Nivel actualizado exitosamente",
      nivel,
    });
  } catch (error) {
    logger.error("Error en actualizarNivel:", error);
    return res.status(500).json({
      message: "Error al actualizar nivel",
      error: error.message,
    });
  }
};

export const eliminarNivel = async (req, res) => {
  try {
    const { id } = req.params;

    const nivel = await db.nivel.findByPk(id);

    if (!nivel) {
      return res.status(404).json({
        message: "Nivel no encontrado",
      });
    }

    const tieneHistorial = await db.historialNivel.count({
      where: {
        [db.Sequelize.Op.or]: [
          { id_nivel_anterior: id },
          { id_nivel_nuevo: id },
        ],
      },
    });

    if (tieneHistorial > 0) {
      return res.status(400).json({
        message:
          "No se puede eliminar el nivel porque tiene historial asociado",
      });
    }

    await nivel.destroy();

    logger.info(`Nivel eliminado: ${nivel.nombre_nivel}`);

    return res.status(200).json({
      message: "Nivel eliminado correctamente",
    });
  } catch (error) {
    logger.error("Error en eliminarNivel:", error);
    return res.status(500).json({
      message: "Error al eliminar nivel",
      error: error.message,
    });
  }
};

export default {
  listarNiveles,
  listarNivelesActivos,
  obtenerNivel,
  crearNivel,
  actualizarNivel,
  eliminarNivel,
};
