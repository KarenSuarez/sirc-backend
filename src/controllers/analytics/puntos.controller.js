import db from "../../models/index.js";
import puntosService from "../../services/puntos.service.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("puntos.controller");

export const obtenerMiHistorial = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { limite = 50, pagina = 1 } = req.query;

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows } = await db.movimientoReferencia.findAndCountAll({
      where: { id_referente: id_usuario },
      include: [
        {
          model: db.referido,
          as: "referido",
          attributes: [
            "nombre_referido",
            "apellido_referido",
            "empresa_referido",
          ],
        },
      ],
      order: [["fecha_movimiento", "DESC"]],
      limit: parseInt(limite),
      offset,
    });

    const referente = await db.referente.findByPk(id_usuario, {
      attributes: ["puntos_actuales", "puntos_totales_historico"],
    });

    return res.status(200).json({
      puntos_actuales: referente.puntos_actuales,
      puntos_totales_historico: referente.puntos_totales_historico,
      total_movimientos: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas: Math.ceil(count / parseInt(limite)),
      movimientos: rows,
    });
  } catch (error) {
    logger.error("Error en obtenerMiHistorial:", error);
    return res.status(500).json({
      message: "Error al obtener historial de puntos",
      error: error.message,
    });
  }
};

export const obtenerHistorialPorReferente = async (req, res) => {
  try {
    const { id_referente } = req.params;
    const { limite = 50, pagina = 1 } = req.query;

    const referente = await db.referente.findByPk(id_referente, {
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: ["nombre", "apellido", "numero_documento"],
        },
      ],
    });

    if (!referente) {
      return res.status(404).json({
        message: "Referente no encontrado",
      });
    }

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows } = await db.movimientoReferencia.findAndCountAll({
      where: { id_referente: parseInt(id_referente) },
      include: [
        {
          model: db.referido,
          as: "referido",
          attributes: [
            "nombre_referido",
            "apellido_referido",
            "empresa_referido",
          ],
        },
      ],
      order: [["fecha_movimiento", "DESC"]],
      limit: parseInt(limite),
      offset,
    });

    return res.status(200).json({
      referente: {
        codigo_referente: referente.codigo_referente,
        nombre: referente.usuario.nombre,
        apellido: referente.usuario.apellido,
        puntos_actuales: referente.puntos_actuales,
        puntos_totales_historico: referente.puntos_totales_historico,
      },
      total_movimientos: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas: Math.ceil(count / parseInt(limite)),
      movimientos: rows,
    });
  } catch (error) {
    logger.error("Error en obtenerHistorialPorReferente:", error);
    return res.status(500).json({
      message: "Error al obtener historial de puntos",
      error: error.message,
    });
  }
};

export const recalcularPuntos = async (req, res) => {
  try {
    if (typeof puntosService.recalcularPuntosReferentes === "function") {
      await puntosService.recalcularPuntosReferentes();
      logger.info("Puntos recalculados para todos los referentes");
    } else {
      const referentes = await db.referente.findAll();

      for (const referente of referentes) {
        const totalPuntos = await db.movimientoReferencia.sum(
          "puntos_otorgados",
          {
            where: { id_referente: referente.id_usuario },
          }
        );

        await referente.update({
          puntos_totales_historico: totalPuntos || 0,
          puntos_actuales: totalPuntos || 0,
        });
      }

      logger.info(`Puntos recalculados para ${referentes.length} referentes`);
    }

    return res.status(200).json({
      message: "Puntos recalculados exitosamente",
    });
  } catch (error) {
    logger.error("Error en recalcularPuntos:", error);
    return res.status(500).json({
      message: "Error al recalcular puntos",
      error: error.message,
    });
  }
};

export const obtenerEstadisticasPuntos = async (req, res) => {
  try {
    const totalPuntos = await db.referente.sum("puntos_totales_historico");

    const promedioPuntos = await db.referente.findOne({
      attributes: [
        [
          db.sequelize.fn("AVG", db.sequelize.col("puntos_actuales")),
          "promedio",
        ],
      ],
    });

    const topReferente = await db.referente.findOne({
      order: [["puntos_actuales", "DESC"]],
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: ["nombre", "apellido"],
        },
      ],
    });

    const distribucionPorNivel = await db.sequelize.query(
      `
      SELECT 
        n.nombre_nivel,
        COUNT(DISTINCT hn.id_referente) as cantidad_referentes,
        SUM(r.puntos_actuales) as total_puntos
      FROM Nivel n
      LEFT JOIN HistorialNivel hn ON n.id_nivel = hn.id_nivel_nuevo AND hn.activo = :activo
      LEFT JOIN Referente r ON hn.id_referente = r.id_usuario
      GROUP BY n.id_nivel, n.nombre_nivel, n.orden_nivel
      ORDER BY n.orden_nivel ASC
      `,
      {
        replacements: { activo: true },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      total_puntos: parseFloat(totalPuntos || 0),
      promedio_puntos: parseFloat(promedioPuntos?.dataValues?.promedio || 0),
      top_referente: topReferente
        ? {
            codigo_referente: topReferente.codigo_referente,
            nombre: topReferente.usuario.nombre,
            apellido: topReferente.usuario.apellido,
            puntos: topReferente.puntos_actuales,
          }
        : null,
      distribucion_por_nivel: distribucionPorNivel,
    });
  } catch (error) {
    logger.error("Error en obtenerEstadisticasPuntos:", error);
    return res.status(500).json({
      message: "Error al obtener estadísticas de puntos",
      error: error.message,
    });
  }
};

export default {
  obtenerMiHistorial,
  obtenerHistorialPorReferente,
  recalcularPuntos,
  obtenerEstadisticasPuntos,
};
