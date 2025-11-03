import db from "../models/index.js";
const Referente = db.referente;
const Referido = db.refered;

export const obtenerRankingReferentes = async (req, res) => {
  try {
    const { tipo = "puntos", limite = 10 } = req.query;

    // Validar tipo de ranking
    if (!["puntos", "referidos"].includes(tipo)) {
      return res.status(400).json({ message: "Tipo de ranking inválido (use 'puntos' o 'referidos')" });
    }

    // Traemos los referentes activos
    const referentes = await Referente.findAll({
      where: { estado_referente: "activo" },
      attributes: [
        "numero_documento_identidad",
        "tipo_referente",
        "puntos_acumulados",
        "categoria_actual",
        "recompensa_monetaria_actual"
      ],
      raw: true
    });

    // Contamos cuántos referidos tiene cada referente
    const referidos = await Referido.findAll({
      attributes: [
        "documento_referente",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("documento_referente")), "total_referidos"]
      ],
      group: ["documento_referente"],
      raw: true
    });

    // Combinamos la info
    const ranking = referentes.map(ref => {
      const refInfo = referidos.find(r => r.documento_referente === ref.numero_documento_identidad);
      return {
        ...ref,
        total_referidos: refInfo ? parseInt(refInfo.total_referidos) : 0
      };
    });

    // Ordenamos según el tipo de ranking
    ranking.sort((a, b) => {
      if (tipo === "puntos") return b.puntos_acumulados - a.puntos_acumulados;
      else return b.total_referidos - a.total_referidos;
    });

    // Respondemos
    res.json({
      message: "Ranking obtenido correctamente",
      total: ranking.length,
      data: ranking.slice(0, parseInt(limite))
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener ranking de referentes",
      error: error.message
    });
  }
};
