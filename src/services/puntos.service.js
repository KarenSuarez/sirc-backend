import db from "../models/index.js";
import createLogger from "../utils/logger.js";

const logger = createLogger("puntos.service.js");

class PuntosService {
  async recalcularPuntosReferentes() {
    try {
      logger.info("Iniciando recálculo de puntos...");

      const referentes = await db.referente.findAll({
        attributes: ["id_usuario", "codigo_referente"],
      });

      let actualizados = 0;

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

        actualizados++;
      }

      logger.info(`Puntos recalculados para ${actualizados} referentes`);

      return {
        success: true,
        referentes_actualizados: actualizados,
      };
    } catch (error) {
      logger.error("Error al recalcular puntos:", error);
      throw error;
    }
  }

  /**
   * Obtener historial de puntos de un referente
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Array>} Historial de movimientos
   */
  async obtenerHistorialPuntos(id_referente) {
    try {
      const historial = await db.movimientoReferencia.findAll({
        where: {
          id_referente,
          puntos_otorgados: { [db.Sequelize.Op.gt]: 0 },
        },
        attributes: [
          "id_movimiento",
          "puntos_otorgados",
          "fecha_movimiento",
          "estado_comision",
        ],
        include: [
          {
            model: db.referido,
            as: "referido",
            attributes: ["nombre_referido", "apellido_referido"],
          },
        ],
        order: [["fecha_movimiento", "DESC"]],
      });

      return historial;
    } catch (error) {
      logger.error("Error al obtener historial de puntos:", error);
      throw error;
    }
  }

  /**
   * Descontar puntos a un referente (ej. canje de recompensa)
   * @param {number} id_usuario - ID del referente
   * @param {number} puntos - Puntos a descontar
   * @param {string} motivo - Motivo del descuento
   * @returns {Promise<Object>} Referente actualizado
   */
  async descontarPuntos(id_usuario, puntos, motivo = "Canje de recompensa") {
    const transaction = await db.sequelize.transaction();

    try {
      const referente = await db.referente.findByPk(id_usuario, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      if (referente.puntos_actuales < puntos) {
        throw new Error("Puntos insuficientes");
      }

      await referente.decrement({ puntos_actuales: puntos }, { transaction });

      await transaction.commit();

      logger.info(`${puntos} puntos descontados de referente ${id_usuario}`);

      return referente;
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al descontar puntos:", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas generales de puntos del sistema
   * @returns {Promise<Object>} Estadísticas
   */
  async obtenerEstadisticasGenerales() {
    try {
      const [totalPuntos, promedioPuntos, totalReferentes] = await Promise.all([
        db.referente.sum("puntos_totales_historico"),
        db.referente.findOne({
          attributes: [
            [
              db.sequelize.fn("AVG", db.sequelize.col("puntos_actuales")),
              "promedio",
            ],
          ],
        }),
        db.referente.count({ where: { estado_referente: "activo" } }),
      ]);

      return {
        total_puntos_sistema: parseFloat(totalPuntos || 0),
        promedio_puntos_referente: parseFloat(
          promedioPuntos?.dataValues?.promedio || 0
        ),
        total_referentes_activos: totalReferentes,
      };
    } catch (error) {
      logger.error("Error al obtener estadísticas de puntos:", error);
      throw error;
    }
  }
}

export default new PuntosService();