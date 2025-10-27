import ConfigPointsPlan from "../models/configPointsPlan.model.js";
import { recalcularPuntosReferentes } from "../services/recalculoPuntos.service.js";

// GET /api/config-puntos-plan
export const listarConfigPlanes = async (req, res) => {
  try {
    const configuraciones = await ConfigPointsPlan.findAll();
    res.json(configuraciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al listar configuración de puntos",
      error: error.message,
    });
  }
};

// POST /api/config-puntos-plan
export const actualizarConfigPlan = async (req, res) => {
  try {
    const { id_config, nombre_plan, puntos_por_referido, vigente } = req.body;
    let config;

    if (id_config) {
      config = await ConfigPointsPlan.findByPk(id_config);
      if (!config) return res.status(404).json({ message: "Configuración no encontrada" });

      await config.update({ nombre_plan, puntos_por_referido, vigente });
    } else {
      config = await ConfigPointsPlan.create({ nombre_plan, puntos_por_referido, vigente });
    }

    // Recalculo automático de puntos totales
    await recalcularPuntosReferentes();

    res.json({ message: "Configuración actualizada y puntos recalculados", config });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar configuración", error: error.message });
  }
};
