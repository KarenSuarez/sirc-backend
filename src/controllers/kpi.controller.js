import db from "../models/index.js";
import { literal } from "sequelize";

export const obtenerRankingReferentes = async (req, res) => {
  try {
    const resultados = await db.Referido.findAll({
      attributes: [
        "documento_referente",
        [db.sequelize.fn("COUNT", db.sequelize.col("*")), "total_referidos"],
        [db.sequelize.fn("SUM", db.sequelize.col("puntos_generados")), "total_puntos"],
        [db.sequelize.fn("SUM", db.sequelize.col("recompensa_generada")), "total_recompensa"],
        [
          literal(
            "SUM(CASE WHEN estado_referido = 'activo' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)"
          ),
          "tasa_conversion"
        ]
      ],
      include: [
        {
          model: db.Referente,
          as: "referente", 
          attributes: ["numero_documento_identidad", "categoria_actual", "puntos_acumulados"],
          include: [
            {
              model: db.Usuario, 
              as: "usuario",
              attributes: ["nombre", "apellido", "correo"]
            }
          ]
        }
      ],
      group: ["documento_referente", "referente.numero_documento_identidad", "referente->usuario.nombre", "referente->usuario.apellido", "referente->usuario.correo", "referente.categoria_actual", "referente.puntos_acumulados"],
      order: [[literal("total_puntos"), "DESC"]]
    });

    res.json(resultados);
  } catch (error) {
    console.error("Error obteniendo ranking de referentes:", error);
    res.status(500).json({ message: "Error generando ranking" });
  }
};
