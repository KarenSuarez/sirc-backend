import db from "../models/index.js";

const HistorialCategoria = db.historialCategoria;
const Referente = db.referente;

/**
 * @swagger
 * /historial/categorias:
 *   get:
 *     summary: Obtener historial de cambios de categoría
 *     tags: [Historial - Categorías]
 *     responses:
 *       200:
 *         description: Lista de cambios de categoría
 */
export const listarHistorialCategorias = async (req, res) => {
  try {
    const historial = await HistorialCategoria.findAll({
      include: [
        {
          model: Referente,
          attributes: ["numero_documento_identidad", "categoria_actual"],
        },
      ],
      order: [["fecha_cambio", "DESC"]],
    });

    res.status(200).json(historial);
  } catch (error) {
    console.error(" Error al listar historial de categorías:", error);
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
};

/**
 * @swagger
 * /historial/categorias/{documento}:
 *   get:
 *     summary: Obtener historial de categorías de un referente específico
 *     tags: [Historial - Categorías]
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
export const historialCategoriaPorReferente = async (req, res) => {
  try {
    const { documento } = req.params;
    const historial = await HistorialCategoria.findAll({
      where: { id_referente: documento },
      order: [["fecha_cambio", "DESC"]],
    });

    res.status(200).json(historial);
  } catch (error) {
    console.error(" Error al obtener historial de categoría:", error);
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
};
