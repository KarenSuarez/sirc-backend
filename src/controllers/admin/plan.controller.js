import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("plan.controller");

export const listarPlanes = async (req, res) => {
  try {
    const { estado } = req.query;

    const where = {};
    if (estado) {
      where.estado_plan = estado;
    }

    const planes = await db.plan.findAll({
      where,
      order: [["creado_en", "DESC"]],
    });

    return res.status(200).json(planes);
  } catch (error) {
    logger.error("Error en listarPlanes:", error);
    return res.status(500).json({
      message: "Error al listar planes",
      error: error.message,
    });
  }
};

export const obtenerPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await db.plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({
        message: "Plan no encontrado",
      });
    }

    return res.status(200).json(plan);
  } catch (error) {
    logger.error("Error en obtenerPlan:", error);
    return res.status(500).json({
      message: "Error al obtener plan",
      error: error.message,
    });
  }
};

export const crearPlan = async (req, res) => {
  try {
    const {
      nombre_plan,
      descripcion,
      precio_actual,
      porcentaje_comision_base,
      puntos_otorgados,
      icono_plan,
      color_plan,
    } = req.body;

    if (
      !nombre_plan ||
      !precio_actual ||
      !porcentaje_comision_base ||
      !puntos_otorgados
    ) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
      });
    }

    const nuevoPlan = await db.plan.create({
      nombre_plan,
      descripcion: descripcion || null,
      precio_actual: parseFloat(precio_actual),
      porcentaje_comision_base: parseFloat(porcentaje_comision_base),
      puntos_otorgados: parseInt(puntos_otorgados),
      estado_plan: "activo",
      icono_plan: icono_plan || null,
      color_plan: color_plan || null,
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    logger.info(`Plan creado: ${nuevoPlan.nombre_plan}`);

    return res.status(201).json({
      message: "Plan creado exitosamente",
      plan: nuevoPlan,
    });
  } catch (error) {
    logger.error("Error en crearPlan:", error);
    return res.status(500).json({
      message: "Error al crear plan",
      error: error.message,
    });
  }
};

export const actualizarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_plan,
      descripcion,
      precio_actual,
      porcentaje_comision_base,
      puntos_otorgados,
      estado_plan,
      icono_plan,
      color_plan,
    } = req.body;

    const plan = await db.plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({
        message: "Plan no encontrado",
      });
    }

    await plan.update({
      nombre_plan: nombre_plan || plan.nombre_plan,
      descripcion: descripcion !== undefined ? descripcion : plan.descripcion,
      precio_actual: precio_actual
        ? parseFloat(precio_actual)
        : plan.precio_actual,
      porcentaje_comision_base: porcentaje_comision_base
        ? parseFloat(porcentaje_comision_base)
        : plan.porcentaje_comision_base,
      puntos_otorgados: puntos_otorgados
        ? parseInt(puntos_otorgados)
        : plan.puntos_otorgados,
      estado_plan: estado_plan || plan.estado_plan,
      icono_plan: icono_plan !== undefined ? icono_plan : plan.icono_plan,
      color_plan: color_plan !== undefined ? color_plan : plan.color_plan,
      actualizado_en: new Date(),
    });

    logger.info(`Plan actualizado: ${plan.nombre_plan}`);

    return res.status(200).json({
      message: "Plan actualizado exitosamente",
      plan,
    });
  } catch (error) {
    logger.error("Error en actualizarPlan:", error);
    return res.status(500).json({
      message: "Error al actualizar plan",
      error: error.message,
    });
  }
};

export const eliminarPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await db.plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({
        message: "Plan no encontrado",
      });
    }

    const referidosActivos = await db.referido.count({
      where: {
        id_plan_adquirido: id,
        estado_referido: "activo",
      },
    });

    if (referidosActivos > 0) {
      return res.status(400).json({
        message: `No se puede desactivar el plan porque tiene ${referidosActivos} referidos activos`,
      });
    }

    await plan.update({
      estado_plan: "inactivo",
      actualizado_en: new Date(),
    });

    logger.info(`Plan desactivado: ${plan.nombre_plan}`);

    return res.status(200).json({
      message: "Plan desactivado correctamente",
    });
  } catch (error) {
    logger.error("Error en eliminarPlan:", error);
    return res.status(500).json({
      message: "Error al eliminar plan",
      error: error.message,
    });
  }
};

export default {
  listarPlanes,
  obtenerPlan,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
};
