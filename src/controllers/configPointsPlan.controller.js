import ConfigPointsPlan from "../models/configPuntosPlan.model.js";

// GET /api/config-puntos-plan
export const listarConfigPlanes = async (req, res) => {
  try {
    const configuraciones = await ConfigPointsPlan.findAll();
    res.json(configuraciones);
  } catch (error) {
    res.status(500).json({ message: "Error al listar configuración de puntos", error: error.message });
  }
};

// POST /api/config-puntos-plan
export const actualizarConfigPlan = async (req, res) => {
  try {
    const { id_config, nombre_plan, puntos_por_referido, vigente } = req.body;

    if (id_config) {
      // Actualiza si ya existe
      const config = await ConfigPointsPlan.findByPk(id_config);
      if (!config) return res.status(404).json({ message: "Configuración no encontrada" });

      await config.update({ nombre_plan, puntos_por_referido, vigente });
      return res.json({ message: "Configuración actualizada", config });
    } else {
      // Crea una nueva configuración
      const nueva = await ConfigPointsPlan.create({ nombre_plan, puntos_por_referido, vigente });
      return res.status(201).json({ message: "Configuración creada", nueva });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al guardar configuración", error: error.message });
  }
};
