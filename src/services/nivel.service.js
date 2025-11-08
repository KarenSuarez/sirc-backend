import db from "../models/index.js";
import createLogger from "../utils/logger.js";

const logger = createLogger("nivel.service.js");

class NivelService {
  /**
   * Obtener el nivel actual de un referente
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Object|null>} Nivel actual
   */
  async obtenerNivelActual(id_referente) {
    try {
      const referente = await db.referente.findByPk(id_referente);
      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const puntosActuales = referente.puntos_actuales;

      const nivelActual = await db.nivel.findOne({
        where: {
          puntos_minimos: { [db.Sequelize.Op.lte]: puntosActuales },
          puntos_maximos: { [db.Sequelize.Op.gte]: puntosActuales },
        },
      });

      return nivelActual;
    } catch (error) {
      logger.error("Error al obtener nivel actual:", error);
      throw error;
    }
  }

  /**
   * Calcular el progreso del referente hacia el siguiente nivel
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Object>} Información de progreso
   */
  async calcularProgresoNivel(id_referente) {
    try {
      return await this.obtenerProgresoNivel(id_referente);
    } catch (error) {
      logger.error("Error al calcular progreso de nivel:", error);
      throw error;
    }
  }

  /**
   * Obtener historial de niveles de un referente
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Array>} Historial de cambios de nivel
   */
  async obtenerHistorialNiveles(id_referente) {
    try {
      const historial = await db.historialNivel.findAll({
        where: { id_referente },
        include: [
          {
            model: db.nivel,
            as: "nivelAnterior",
            attributes: ["id_nivel", "nombre_nivel", "orden_nivel"],
          },
          {
            model: db.nivel,
            as: "nivelNuevo",
            attributes: ["id_nivel", "nombre_nivel", "orden_nivel"],
          },
        ],
        order: [["fecha_cambio", "DESC"]],
      });

      return historial;
    } catch (error) {
      logger.error("Error al obtener historial de niveles:", error);
      throw error;
    }
  }

  /**
   * Verifica y actualiza el nivel de un referente según sus puntos
   * @param {number} id_referente - ID del referente
   * @param {number} puntos_actuales - Puntos actuales del referente
   * @returns {Promise<Object|null>} Información del cambio de nivel o null si no hubo cambio
   */
  async verificarYActualizarNivel(id_referente, puntos_actuales) {
    try {
      const historialActual = await db.historialNivel.findOne({
        where: {
          id_referente,
          activo: true,
        },
        include: [
          {
            model: db.nivel,
            as: "nivelNuevo",
          },
        ],
      });

      const nivelCorrespondiente = await db.nivel.findOne({
        where: {
          puntos_minimos: { [db.Sequelize.Op.lte]: puntos_actuales },
          puntos_maximos: { [db.Sequelize.Op.gte]: puntos_actuales },
        },
      });

      if (!nivelCorrespondiente) {
        logger.warn(`No se encontró nivel para ${puntos_actuales} puntos`);
        return null;
      }

      if (!historialActual) {
        logger.info(
          `Creando primer historial de nivel para referente ${id_referente}: Nivel ${nivelCorrespondiente.nombre_nivel}`
        );
        await db.historialNivel.create({
          id_referente,
          id_nivel_anterior: null,
          id_nivel_nuevo: nivelCorrespondiente.id_nivel,
          puntos_momento: puntos_actuales,
          fecha_cambio: new Date(),
          activo: true,
        });
        return {
          cambio: true,
          nivel_anterior: null,
          nivel_nuevo: nivelCorrespondiente,
        };
      }

      if (historialActual.id_nivel_nuevo !== nivelCorrespondiente.id_nivel) {
        logger.info(
          `Cambio de nivel para referente ${id_referente}: ${historialActual.nivelNuevo.nombre_nivel} -> ${nivelCorrespondiente.nombre_nivel}`
        );

        const transaction = await db.sequelize.transaction();
        try {
          await historialActual.update({ activo: false }, { transaction });

          await db.historialNivel.create(
            {
              id_referente,
              id_nivel_anterior: historialActual.id_nivel_nuevo,
              id_nivel_nuevo: nivelCorrespondiente.id_nivel,
              puntos_momento: puntos_actuales,
              fecha_cambio: new Date(),
              activo: true,
            },
            { transaction }
          );

          await transaction.commit();

          return {
            cambio: true,
            nivel_anterior: historialActual.nivelNuevo,
            nivel_nuevo: nivelCorrespondiente,
          };
        } catch (error) {
          await transaction.rollback();
          logger.error(
            `Error en transacción de cambio de nivel para referente ${id_referente}:`,
            error
          );
          throw error;
        }
      }

      return { cambio: false, nivel_actual: historialActual.nivelNuevo };
    } catch (error) {
      logger.error("Error al verificar/actualizar nivel:", error);
      throw error;
    }
  }

  /**
   * Obtener el progreso del referente hacia el siguiente nivel
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Object>} Información de progreso
   */
  async obtenerProgresoNivel(id_referente) {
    try {
      const referente = await db.referente.findByPk(id_referente);
      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const puntosActuales = referente.puntos_actuales;

      const nivelActual = await db.nivel.findOne({
        where: {
          puntos_minimos: { [db.Sequelize.Op.lte]: puntosActuales },
          puntos_maximos: { [db.Sequelize.Op.gte]: puntosActuales },
        },
      });

      if (!nivelActual) {
        logger.warn(
          `No se encontró nivel para ${puntosActuales} puntos (ID referente: ${id_referente})`
        );
        return {
          nivel_actual: null,
          puntos_actuales: puntosActuales,
          puntos_siguiente_nivel: null,
          puntos_faltantes: null,
          porcentaje_progreso: 0,
        };
      }

      const siguienteNivel = await db.nivel.findOne({
        where: {
          orden_nivel: nivelActual.orden_nivel + 1,
        },
      });

      if (!siguienteNivel) {
        return {
          nivel_actual: nivelActual,
          puntos_actuales: puntosActuales,
          puntos_siguiente_nivel: null,
          puntos_faltantes: 0,
          porcentaje_progreso: 100,
          mensaje: "Nivel máximo alcanzado",
        };
      }

      const puntosFaltantes = siguienteNivel.puntos_minimos - puntosActuales;
      const rangoNivelActual = Math.max(
        1,
        nivelActual.puntos_maximos - nivelActual.puntos_minimos
      );
      const puntosEnNivel = puntosActuales - nivelActual.puntos_minimos;
      const porcentajeProgreso = Math.max(
        0,
        Math.min(100, (puntosEnNivel / rangoNivelActual) * 100)
      );

      return {
        nivel_actual: nivelActual,
        siguiente_nivel: siguienteNivel,
        puntos_actuales: puntosActuales,
        puntos_siguiente_nivel: siguienteNivel.puntos_minimos,
        puntos_faltantes: puntosFaltantes,
        porcentaje_progreso: parseFloat(porcentajeProgreso.toFixed(2)),
      };
    } catch (error) {
      logger.error("Error al obtener progreso de nivel:", error);
      throw error;
    }
  }
}

export default new NivelService();