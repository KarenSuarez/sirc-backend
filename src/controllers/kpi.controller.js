import { Parser as Json2CsvParser } from "json2csv";
import db from "../models/index.js";
import { literal } from "sequelize";

/**
 * @swagger
 * /api/kpis/ranking/export-csv
 *   get:
 *     summary: Exporta el ranking de referentes a un archivo CSV
 *     description: >
 *       Genera un ranking de referentes con sus puntos acumulados, categoría actual,
 *       cantidad de referidos, recompensas totales y tasa de conversión.  
 *       El resultado se exporta en formato **CSV** y se descarga automáticamente.
 *     tags:
 *       - KPIs
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: Archivo CSV exportado exitosamente.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *             example: |
 *               Documento,Nombre,Apellido,Categoria,Puntos_Acumulados,Total_Referidos,Recompensa_Total,Tasa_Conversion
 *               123456789,Laura,Vela,Oro,1200,5,30000,80.00%
 *       500:
 *         description: Error al generar el archivo CSV.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error exportando CSV"
 *                 error:
 *                   type: string
 *                   example: "Error de conexión o consulta SQL"
 */


const exportarRankingCSV = async (req, res) => {
  try {
    const resultados = await db.refered.findAll({
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
          model: db.usuario,
          as: "referente", 
          attributes: ["numero_documento_identidad", "nombre", "apellido", "correo_electronico"],
          include: [
            {
              model: db.referente,
              as: "referente", 
              attributes: ["categoria_actual", "puntos_acumulados"]
            }
          ]
        }
      ],
      group: [
        "documento_referente",
        "referente.numero_documento_identidad",
        "referente.nombre",
        "referente.apellido",
        "referente.correo_electronico",
        "referente->referente.categoria_actual",
        "referente->referente.puntos_acumulados"
      ],
      order: [[literal("total_puntos"), "DESC"]]
    });

    const data = resultados.map(r => ({
      Documento: r.documento_referente,
      Nombre: r.referente?.nombre || "N/A",
      Apellido: r.referente?.apellido || "N/A",
      Categoria: r.referente?.referente?.categoria_actual || "N/A",
      Puntos_Acumulados: r.referente?.referente?.puntos_acumulados || 0,
      Total_Referidos: r.dataValues.total_referidos,
      Recompensa_Total: r.dataValues.total_recompensa,
      Tasa_Conversion: `${parseFloat(r.dataValues.tasa_conversion).toFixed(2)}%`
    }));

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

    res.header("Content-Type", "text/csv");
    res.attachment("ranking_referentes.csv");
    return res.send(csv);

  } catch (error) {
    console.error("Error exportando ranking CSV:", error);
    res.status(500).json({ message: "Error exportando CSV", error: error.message });
  }
};

export default {
  exportarRankingCSV,
};
