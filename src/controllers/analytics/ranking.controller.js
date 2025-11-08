import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("ranking.controller");

export const obtenerRankingPorPuntos = async (req, res) => {
  try {
    const { limite = 10, periodo = "mes" } = req.query;

    let campoOrdenar = "puntos_actuales";
    if (periodo === "historico") {
      campoOrdenar = "puntos_totales_historico";
    }

    const ranking = await db.referente.findAll({
      attributes: [
        "id_usuario",
        "codigo_referente",
        "puntos_actuales",
        "puntos_totales_historico",
      ],
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: ["nombre", "apellido"],
        },
        {
          model: db.nivel,
          as: "nivelActual",
          attributes: ["nombre_nivel", "icono_nivel", "color_nivel"],
          through: {
            where: { activo: true },
            attributes: [],
          },
          required: false,
        },
      ],
      where: { estado_referente: "activo" },
      order: [[campoOrdenar, "DESC"]],
      limit: parseInt(limite),
    });

    const rankingConPosicion = ranking.map((item, index) => ({
      posicion: index + 1,
      ...item.toJSON(),
    }));

    return res.status(200).json({
      periodo,
      total: rankingConPosicion.length,
      ranking: rankingConPosicion,
    });
  } catch (error) {
    logger.error("Error en obtenerRankingPorPuntos:", error);
    return res.status(500).json({
      message: "Error al obtener ranking por puntos",
      error: error.message,
    });
  }
};

export const obtenerRankingPorComisiones = async (req, res) => {
  try {
    const { limite = 10, periodo = "mes" } = req.query;

    const fechaFin = new Date();
    const fechaInicio = new Date();

    switch (periodo) {
      case "semana":
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        break;
      case "mes":
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
      case "trimestre":
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);
        break;
      case "año":
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
      default:
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }

    const ranking = await db.sequelize.query(
      `
      SELECT 
        r.id_usuario,
        r.codigo_referente,
        u.nombre,
        u.apellido,
        SUM(mr.monto_comision) as total_comisiones,
        COUNT(mr.id_movimiento) as cantidad_comisiones
      FROM Referente r
      INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
      LEFT JOIN MovimientoReferencia mr ON r.id_usuario = mr.id_referente
        AND mr.fecha_movimiento BETWEEN :fechaInicio AND :fechaFin
      WHERE r.estado_referente = :estadoActivo
      GROUP BY r.id_usuario, r.codigo_referente, u.nombre, u.apellido
      HAVING total_comisiones > 0
      ORDER BY total_comisiones DESC
      LIMIT :limite
      `,
      {
        replacements: {
          fechaInicio,
          fechaFin,
          estadoActivo: "activo",
          limite: parseInt(limite),
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const rankingConPosicion = ranking.map((item, index) => ({
      posicion: index + 1,
      ...item,
      total_comisiones: parseFloat(item.total_comisiones),
    }));

    return res.status(200).json({
      periodo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      total: rankingConPosicion.length,
      ranking: rankingConPosicion,
    });
  } catch (error) {
    logger.error("Error en obtenerRankingPorComisiones:", error);
    return res.status(500).json({
      message: "Error al obtener ranking por comisiones",
      error: error.message,
    });
  }
};

export const obtenerRankingPorReferidos = async (req, res) => {
  try {
    const { limite = 10, periodo = "mes" } = req.query;

    let whereCondition = "ref.estado_referido = :estadoActivo";
    const replacements = {
      estadoActivo: "activo",
      limite: parseInt(limite),
    };

    if (periodo !== "historico") {
      const fechaFin = new Date();
      const fechaInicio = new Date();

      switch (periodo) {
        case "semana":
          fechaInicio.setDate(fechaInicio.getDate() - 7);
          break;
        case "mes":
          fechaInicio.setMonth(fechaInicio.getMonth() - 1);
          break;
        case "trimestre":
          fechaInicio.setMonth(fechaInicio.getMonth() - 3);
          break;
        case "año":
          fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
          break;
      }

      whereCondition +=
        " AND ref.fecha_conversion BETWEEN :fechaInicio AND :fechaFin";
      replacements.fechaInicio = fechaInicio;
      replacements.fechaFin = fechaFin;
    }

    const ranking = await db.sequelize.query(
      `
      SELECT 
        r.id_usuario,
        r.codigo_referente,
        u.nombre,
        u.apellido,
        COUNT(ref.id_referido) as total_referidos
      FROM Referente r
      INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
      LEFT JOIN Referido ref ON r.id_usuario = ref.id_referente AND ${whereCondition}
      WHERE r.estado_referente = :estadoActivo
      GROUP BY r.id_usuario, r.codigo_referente, u.nombre, u.apellido
      HAVING total_referidos > 0
      ORDER BY total_referidos DESC
      LIMIT :limite
      `,
      {
        replacements,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const rankingConPosicion = ranking.map((item, index) => ({
      posicion: index + 1,
      ...item,
    }));

    return res.status(200).json({
      periodo,
      total: rankingConPosicion.length,
      ranking: rankingConPosicion,
    });
  } catch (error) {
    logger.error("Error en obtenerRankingPorReferidos:", error);
    return res.status(500).json({
      message: "Error al obtener ranking por referidos",
      error: error.message,
    });
  }
};

export const obtenerMiPosicion = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { tipo = "puntos" } = req.query;

    let query, replacements;

    if (tipo === "puntos") {
      query = `
        SELECT 
          COUNT(*) + 1 as posicion
        FROM Referente
        WHERE puntos_actuales > (
          SELECT puntos_actuales FROM Referente WHERE id_usuario = :id_usuario
        )
        AND estado_referente = :estadoActivo
      `;
      replacements = {
        id_usuario: parseInt(id_usuario),
        estadoActivo: "activo",
      };
    } else if (tipo === "comisiones") {
      query = `
        SELECT 
          COUNT(*) + 1 as posicion
        FROM Referente
        WHERE total_comisiones_historico > (
          SELECT total_comisiones_historico FROM Referente WHERE id_usuario = :id_usuario
        )
        AND estado_referente = :estadoActivo
      `;
      replacements = {
        id_usuario: parseInt(id_usuario),
        estadoActivo: "activo",
      };
    } else {
      query = `
        SELECT 
          COUNT(*) + 1 as posicion
        FROM (
          SELECT 
            id_referente,
            COUNT(id_referido) as total
          FROM Referido
          WHERE estado_referido = :estadoActivo
          GROUP BY id_referente
        ) as subquery
        WHERE total > (
          SELECT COUNT(*) 
          FROM Referido 
          WHERE id_referente = :id_usuario AND estado_referido = :estadoActivo
        )
      `;
      replacements = {
        id_usuario: parseInt(id_usuario),
        estadoActivo: "activo",
      };
    }

    const resultado = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const posicion = resultado[0]?.posicion || 1;

    const referente = await db.referente.findByPk(id_usuario, {
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: ["nombre", "apellido"],
        },
      ],
    });

    return res.status(200).json({
      posicion,
      tipo_ranking: tipo,
      referente: {
        codigo_referente: referente.codigo_referente,
        nombre: referente.usuario.nombre,
        apellido: referente.usuario.apellido,
        puntos_actuales: referente.puntos_actuales,
        total_comisiones_historico: parseFloat(
          referente.total_comisiones_historico
        ),
      },
    });
  } catch (error) {
    logger.error("Error en obtenerMiPosicion:", error);
    return res.status(500).json({
      message: "Error al obtener posición en ranking",
      error: error.message,
    });
  }
};

export const obtenerRankingGeneral = async (req, res) => {
  try {
    const { limite = 10 } = req.query;

    const ranking = await db.sequelize.query(
      `
      SELECT 
        r.id_usuario,
        r.codigo_referente,
        u.nombre,
        u.apellido,
        r.puntos_actuales,
        r.total_comisiones_historico,
        COUNT(ref.id_referido) as total_referidos,
        (r.puntos_actuales * 0.5 + 
         r.total_comisiones_historico * 0.3 + 
         COUNT(ref.id_referido) * 0.2) as score_general
      FROM Referente r
      INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
      LEFT JOIN Referido ref ON r.id_usuario = ref.id_referente AND ref.estado_referido = :estadoActivo
      WHERE r.estado_referente = :estadoActivo
      GROUP BY r.id_usuario, r.codigo_referente, u.nombre, u.apellido, r.puntos_actuales, r.total_comisiones_historico
      ORDER BY score_general DESC
      LIMIT :limite
      `,
      {
        replacements: {
          estadoActivo: "activo",
          limite: parseInt(limite),
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const rankingConPosicion = ranking.map((item, index) => ({
      posicion: index + 1,
      ...item,
      total_comisiones_historico: parseFloat(item.total_comisiones_historico),
      score_general: parseFloat(item.score_general).toFixed(2),
    }));

    return res.status(200).json({
      total: rankingConPosicion.length,
      ranking: rankingConPosicion,
    });
  } catch (error) {
    logger.error("Error en obtenerRankingGeneral:", error);
    return res.status(500).json({
      message: "Error al obtener ranking general",
      error: error.message,
    });
  }
};

export default {
  obtenerRankingPorPuntos,
  obtenerRankingPorComisiones,
  obtenerRankingPorReferidos,
  obtenerMiPosicion,
  obtenerRankingGeneral,
};
