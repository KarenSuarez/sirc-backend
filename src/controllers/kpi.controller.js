import { Parser as Json2CsvParser } from "json2csv";
import db from "../models/index.js";
import { literal } from "sequelize";

export const exportarRankingCSV = async (req, res) => {
  try {
    // 🔹 1. Obtener los datos igual que en el ranking
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
      group: [
        "documento_referente",
        "referente.numero_documento_identidad",
        "referente->usuario.nombre",
        "referente->usuario.apellido",
        "referente->usuario.correo",
        "referente.categoria_actual",
        "referente.puntos_acumulados"
      ],
      order: [[literal("total_puntos"), "DESC"]]
    });

    // 🔹 2. Transformar los datos para el CSV
    const data = resultados.map(r => ({
      Documento: r.documento_referente,
      Nombre: r.referente?.usuario?.nombre || "N/A",
      Apellido: r.referente?.usuario?.apellido || "N/A",
      Categoria: r.referente?.categoria_actual || "N/A",
      Puntos_Acumulados: r.dataValues.total_puntos,
      Total_Referidos: r.dataValues.total_referidos,
      Recompensa_Total: r.dataValues.total_recompensa,
      Tasa_Conversion: `${parseFloat(r.dataValues.tasa_conversion).toFixed(2)}%`
    }));

    // 🔹 3. Convertir JSON → CSV
    const fields = [
      "Documento",
      "Nombre",
      "Apellido",
      "Categoria",
      "Puntos_Acumulados",
      "Total_Referidos",
      "Recompensa_Total",
      "Tasa_Conversion"
    ];
    const json2csvParser = new Json2CsvParser({ fields });
    const csv = json2csvParser.parse(data);

    // 🔹 4. Configurar encabezados HTTP para descarga
    res.header("Content-Type", "text/csv");
    res.attachment("ranking_referentes.csv");
    return res.send(csv);

  } catch (error) {
    console.error("Error exportando ranking CSV:", error);
    res.status(500).json({ message: "Error exportando CSV", error: error.message });
  }
};
