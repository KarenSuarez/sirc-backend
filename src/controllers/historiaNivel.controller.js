import db from "../models/index.js";

const HistorialNivel = db.historialNivel;
const Referente = db.referente;

/**
 * @swagger
 * /historial/niveles:
 *   get:
 *     summary: Obtener el historial de cambios de nivel de todos los referentes
 *     tags: [Historial - Niveles]
 *     responses:
 *       200:
 *         description: Lista de cambios de nivel
 */
export const listarHistorialNiveles = async (req, res) => {
  try {
    const historial = await HistorialNivel.findAll({
      include: [
        {
          model: Referente,
          attributes: ["numero_documento_identidad", "categoria_actual"],
        },
      ],
      order: [["actualizado_en", "DESC"]],
    });

    res.status(200).json(historial);
  } catch (error) {
    console.error(" Error al listar historial de niveles:", error);
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
};

/**
 * @swagger
 * /api/historial/niveles/{documento}:
 *   get:
 *     summary: Obtener historial de niveles de un referente específico
 *     tags: [Historial - Niveles]
 *     parameters:
 *       - name: documento
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del referente
 *     responses:
 *       200:
 *         description: Historial del referente encontrado
 */
export const historialNivelPorReferente = async (req, res) => {
  try {
    const { documento } = req.params;
    const historial = await HistorialNivel.findAll({
      where: { id_referente: documento },
      order: [["actualizado_en", "DESC"]],
    });

    res.status(200).json(historial);
  } catch (error) {
    console.error(" Error al obtener historial de nivel:", error);
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
};
