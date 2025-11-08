import db from "../models/index.js";
import createLogger from "./logger.js";

const logger = createLogger("usuarioGerente.service.js");

class UsuarioGerenteService {
  /**
   * Obtener equipo de referentes asignados al gerente
   * @param {number} id_gerente - ID del usuario gerente
   * @returns {Promise<Array>} Lista de referentes del equipo
   */
  async obtenerEquipo(id_gerente) {
    try {
      const referentes = await db.referente.findAll({
        include: [
          {
            model: db.usuario,
            as: "usuario",
            attributes: [
              "id_usuario",
              "numero_documento",
              "nombre",
              "apellido",
              "correo_electronico",
              "telefono",
            ],
          },
        ],
        order: [["creado_en", "DESC"]],
      });

      return referentes;
    } catch (error) {
      logger.error("Error al obtener equipo:", error);
      throw error;
    }
  }

  /**
   * Obtener métricas del equipo
   * @param {number} id_gerente - ID del usuario gerente
   * @returns {Promise<Object>} Métricas del equipo
   */
  async obtenerMetricasEquipo(id_gerente) {
    try {
      const referentes = await this.obtenerEquipo(id_gerente);
      const idsReferentes = referentes.map((r) => r.id_usuario);

      const [
        totalComisionesEquipo,
        totalPuntosEquipo,
        nuevosReferidosEquipo,
        conversionesEquipo,
      ] = await Promise.all([
        db.movimientoReferencia.sum("monto_comision", {
          where: {
            id_referente: { [db.Sequelize.Op.in]: idsReferentes },
            estado_comision: "pagada",
          },
        }),
        db.referente.sum("puntos_totales_historico", {
          where: {
            id_usuario: { [db.Sequelize.Op.in]: idsReferentes },
          },
        }),
        db.referido.count({
          where: {
            id_referente: { [db.Sequelize.Op.in]: idsReferentes },
            fecha_creacion: {
              [db.Sequelize.Op.gte]: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ),
            },
          },
        }),
        db.referido.count({
          where: {
            id_referente: { [db.Sequelize.Op.in]: idsReferentes },
            estado_referido: "convertido",
            fecha_conversion: {
              [db.Sequelize.Op.gte]: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ),
            },
          },
        }),
      ]);

      return {
        total_referentes: referentes.length,
        total_comisiones_pagadas: totalComisionesEquipo || 0,
        total_puntos_generados: totalPuntosEquipo || 0,
        nuevos_referidos_30_dias: nuevosReferidosEquipo || 0,
        conversiones_30_dias: conversionesEquipo || 0,
      };
    } catch (error) {
      logger.error("Error al obtener métricas del equipo:", error);
      throw error;
    }
  }

  /**
   * Obtener alertas del equipo (ej. referentes inactivos)
   * @param {number} id_gerente - ID del usuario gerente
   * @returns {Promise<Object>} Alertas
   */
  async obtenerAlertasEquipo(id_gerente) {
    try {
      const referentes = await this.obtenerEquipo(id_gerente);
      const idsReferentes = referentes.map((r) => r.id_usuario);

      const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const sinActividad = await db.referente.findAll({
        where: {
          id_usuario: {
            [db.Sequelize.Op.in]: idsReferentes,
          },
          fecha_ultima_actividad: {
            [db.Sequelize.Op.or]: [
              { [db.Sequelize.Op.lt]: hace30Dias },
              { [db.Sequelize.Op.is]: null },
            ],
          },
        },
        include: [
          {
            model: db.usuario,
            as: "usuario",
            attributes: ["nombre", "apellido", "correo_electronico"],
          },
        ],
      });

      const saldoBajo = await db.referente.findAll({
        where: {
          id_usuario: {
            [db.Sequelize.Op.in]: idsReferentes,
          },
          saldo_disponible: {
            [db.Sequelize.Op.lt]: 10000,
          },
          estado_referente: "activo",
        },
        include: [
          {
            model: db.usuario,
            as: "usuario",
            attributes: ["nombre", "apellido"],
          },
        ],
      });

      return {
        sin_actividad_30_dias: sinActividad.length,
        referentes_sin_actividad: sinActividad,
        con_saldo_bajo: saldoBajo.length,
        referentes_saldo_bajo: saldoBajo,
      };
    } catch (error) {
      logger.error("Error al obtener alertas del equipo:", error);
      throw error;
    }
  }
}

export default new UsuarioGerenteService();
