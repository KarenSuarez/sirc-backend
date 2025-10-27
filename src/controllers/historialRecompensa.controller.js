import db from "../models/index.js";

const Historial_Recompensas = db.historialRecompensa;
const Referente = db.referente;

// ✅ Obtener todo el historial de recompensas
export const listarHistorial = async (req, res) => {
  try {
    const historial = await Historial_Recompensas.findAll({
      include: [
        {
          model: Referente,
          as: "referente",
          attributes: ["numero_documento_identidad", "categoria_actual", "puntos_acumulados"]
        }
      ],
      order: [["fecha_movimiento", "DESC"]]
    });

    res.status(200).json(historial);
  } catch (error) {
    console.error("❌ Error al listar historial:", error);
    res.status(500).json({ message: "Error al obtener el historial de recompensas", error: error.message });
  }
};

// ✅ Crear un nuevo registro de recompensa
export const registrarRecompensa = async (req, res) => {
  try {
    const { numero_documento_identidad, monto, cantidad_puntos, descripcion } = req.body;

    // Validar existencia del referente
    const referente = await Referente.findOne({ where: { numero_documento_identidad } });
    if (!referente) {
      return res.status(404).json({ message: "Referente no encontrado" });
    }

    const nuevaRecompensa = await Historial_Recompensas.create({
      numero_documento_identidad,
      monto,
      cantidad_puntos,
      descripcion,
      fecha_movimiento: new Date()
    });

    // Actualizar puntos acumulados
    referente.puntos_acumulados += cantidad_puntos;
    await referente.save();

    res.status(201).json({
      message: "Recompensa registrada exitosamente",
      recompensa: nuevaRecompensa
    });
  } catch (error) {
    console.error("❌ Error al registrar recompensa:", error);
    res.status(500).json({ message: "Error al registrar recompensa", error: error.message });
  }
};

// ✅ Obtener historial de un referente específico
export const historialPorReferente = async (req, res) => {
  try {
    const { documento } = req.params;
    const historial = await Historial_Recompensas.findAll({
      where: { numero_documento_identidad: documento },
      order: [["fecha_movimiento", "DESC"]]
    });

    res.status(200).json(historial);
  } catch (error) {
    console.error("❌ Error al obtener historial por referente:", error);
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
};
