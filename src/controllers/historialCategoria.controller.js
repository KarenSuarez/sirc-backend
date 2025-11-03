import db from "../models/index.js";
const HistorialCategoria = db.historialCategoria;
const Referente = db.referente;

export const obtenerHistorialCategorias = async (req, res) => {
  try {
    const historial = await HistorialCategoria.findAll({
      include: [
        {
          model: Referente,
          as: "referente",
          attributes: ["numero_documento_identidad", "categoria_actual", "puntos_acumulados"]
        }
      ],
      order: [["fecha_cambio", "DESC"]]
    });

    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const crearHistorialCategoria = async (req, res) => {
  try {
    const { id_referente, categoria_anterior, categoria_nueva, puntos_en_momento } = req.body;

    const nuevoRegistro = await HistorialCategoria.create({
      id_referente,
      categoria_anterior,
      categoria_nueva,
      puntos_en_momento,
      fecha_cambio: new Date()
    });

    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
