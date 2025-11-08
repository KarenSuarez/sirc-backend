import db from "../models/index.js";
import createLogger from "../utils/logger.js";

const logger = createLogger("comision.service.js");

class ComisionService {
  /**
   * Calcula la comisión por un referido convertido
   * @param {Object} params - Parámetros para cálculo
   * @param {number} params.id_referente - ID del referente
   * @param {number} params.id_referido - ID del referido
   * @param {number} params.id_plan - ID del plan adquirido
   * @returns {Promise<Object>} Datos de la comisión calculada
   */
  async calcularComision({ id_referente, id_referido, id_plan }) {
    try {
      const plan = await db.plan.findByPk(id_plan);
      if (!plan) {
        throw new Error("Plan no encontrado");
      }

      const referente = await db.referente.findByPk(id_referente);
      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const nivelActual = await this.determinarNivelPorPuntos(
        referente.puntos_actuales
      );

      const porcentajeComisionBase = parseFloat(plan.porcentaje_comision_base);
      const porcentajeComisionNivel = nivelActual
        ? parseFloat(nivelActual.porcentaje_comision_extra)
        : 0.0;
      const porcentajeComisionTotal =
        porcentajeComisionBase + porcentajeComisionNivel;

      const precioPlano = parseFloat(plan.precio_actual);
      const montoComision = (precioPlano * porcentajeComisionTotal) / 100;

      return {
        precio_plan_momento: precioPlano,
        porcentaje_comision_base: porcentajeComisionBase,
        porcentaje_comision_nivel: porcentajeComisionNivel,
        porcentaje_comision_total: porcentajeComisionTotal,
        monto_comision: montoComision,
        puntos_otorgados: plan.puntos_otorgados,
        nivel_actual: nivelActual ? nivelActual.nombre_nivel : "Bronce",
      };
    } catch (error) {
      logger.error("Error al calcular comisión:", error);
      throw error;
    }
  }

  /**
   * Registra un movimiento de referencia (comisión)
   * @param {Object} params - Datos del movimiento
   * @returns {Promise<Object>} Movimiento creado
   */
  async registrarMovimientoReferencia(params) {
    try {
      const {
        id_referente,
        id_referido,
        precio_plan_momento,
        porcentaje_comision_base,
        porcentaje_comision_nivel,
        porcentaje_comision_total,
        monto_comision,
        puntos_otorgados,
        dias_vencimiento = null,
      } = params;

      let fecha_vencimiento = null;
      if (dias_vencimiento) {
        fecha_vencimiento = new Date();
        fecha_vencimiento.setDate(
          fecha_vencimiento.getDate() + dias_vencimiento
        );
      }

      const movimiento = await db.movimientoReferencia.create({
        id_referente,
        id_referido,
        precio_plan_momento,
        porcentaje_comision_base,
        porcentaje_comision_nivel,
        porcentaje_comision_total,
        monto_comision,
        puntos_otorgados,
        estado_comision: "pendiente",
        fecha_movimiento: new Date(),
        fecha_vencimiento,
      });

      logger.info(
        `Movimiento de referencia registrado: ID ${movimiento.id_movimiento}`
      );
      return movimiento;
    } catch (error) {
      logger.error("Error al registrar movimiento de referencia:", error);
      throw error;
    }
  }

  /**
   * Procesa una comisión completa (calcula + registra + actualiza saldo)
   * @param {Object} params - Parámetros
   * @returns {Promise<Object>} Resultado del procesamiento
   */
  async procesarComisionCompleta({
    id_referente,
    id_referido,
    id_plan,
    dias_vencimiento = null,
    id_usuario_procesa = null,
  }) {
    const transaction = await db.sequelize.transaction();

    try {
      logger.debug(
        `Iniciando procesamiento de comisión para referido ID: ${id_referido}`
      );

      const comisionCalculada = await this.calcularComision({
        id_referente,
        id_referido,
        id_plan,
      });

      const movimientoRef = await this.registrarMovimientoReferencia({
        id_referente,
        id_referido,
        ...comisionCalculada,
        dias_vencimiento,
      });

      const saldoService = (await import("./saldo.service.js")).default;

      const movimientoSaldo = await saldoService.registrarIngresoComision({
        id_referente,
        monto: comisionCalculada.monto_comision,
        puntos: comisionCalculada.puntos_otorgados,
        id_movimiento_referencia: movimientoRef.id_movimiento,
        descripcion: `Comisión por referido ID ${id_referido}`,
        creado_por: id_usuario_procesa,
      });

      const nivelService = (await import("./nivel.service.js")).default;

      const referente = await db.referente.findByPk(id_referente);
      await nivelService.verificarYActualizarNivel(
        id_referente,
        referente.puntos_actuales
      );

      await transaction.commit();

      logger.info(
        `Comisión completa procesada para referido ID: ${id_referido}`
      );

      return {
        success: true,
        comision: comisionCalculada,
        movimiento_referencia: movimientoRef,
        movimiento_saldo: movimientoSaldo,
      };
    } catch (error) {
      await transaction.rollback();
      logger.error(
        `Error al procesar comisión completa para referido ID ${id_referido}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Marca una comisión como pagada
   * @param {number} id_movimiento - ID del movimiento de referencia
   * @returns {Promise<Object>} Movimiento actualizado
   */
  async marcarComoPagada(id_movimiento) {
    try {
      const movimiento = await db.movimientoReferencia.findByPk(id_movimiento);

      if (!movimiento) {
        throw new Error("Movimiento de referencia no encontrado");
      }

      await movimiento.update({
        estado_comision: "pagada",
      });

      logger.info(`Comisión marcada como pagada: ID ${id_movimiento}`);
      return movimiento;
    } catch (error) {
      logger.error("Error al marcar comisión como pagada:", error);
      throw error;
    }
  }

  /**
   * Cancela una comisión
   * @param {number} id_movimiento - ID del movimiento
   * @param {string} motivo - Motivo de cancelación
   * @returns {Promise<Object>} Resultado
   */
  async cancelarComision(id_movimiento, motivo = "Cancelación manual") {
    const transaction = await db.sequelize.transaction();

    try {
      const movimiento = await db.movimientoReferencia.findByPk(id_movimiento);

      if (!movimiento) {
        throw new Error("Movimiento de referencia no encontrado");
      }

      if (movimiento.estado_comision === "pagada") {
        throw new Error("No se puede cancelar una comisión ya pagada");
      }

      await movimiento.update({
        estado_comision: "cancelada",
      });

      const saldoService = (await import("./saldo.service.js")).default;

      await saldoService.registrarAjusteNegativo({
        id_referente: movimiento.id_referente,
        monto: parseFloat(movimiento.monto_comision),
        puntos: movimiento.puntos_otorgados,
        descripcion: `Cancelación de comisión: ${motivo}`,
        id_movimiento_referencia: id_movimiento,
      });

      await transaction.commit();

      logger.info(`Comisión cancelada: ID ${id_movimiento}`);
      return { success: true, message: "Comisión cancelada exitosamente" };
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al cancelar comisión:", error);
      throw error;
    }
  }

  /**
   * Determina el nivel según los puntos actuales
   * @param {number} puntos - Puntos del referente
   * @returns {Promise<Object|null>} Nivel correspondiente
   */
  async determinarNivelPorPuntos(puntos) {
    try {
      const nivel = await db.nivel.findOne({
        where: {
          puntos_minimos: { [db.Sequelize.Op.lte]: puntos },
          puntos_maximos: { [db.Sequelize.Op.gte]: puntos },
        },
      });

      return nivel;
    } catch (error) {
      logger.error("Error al determinar nivel:", error);
      return null;
    }
  }

  /**
   * Obtiene el historial de comisiones de un referente
   * @param {number} id_referente - ID del referente
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Array>} Lista de comisiones
   */
  async obtenerHistorialComisiones(id_referente, filtros = {}) {
    try {
      const where = { id_referente };

      if (filtros.estado_comision) {
        where.estado_comision = filtros.estado_comision;
      }

      if (filtros.fecha_desde) {
        where.fecha_movimiento = {
          [db.Sequelize.Op.gte]: new Date(filtros.fecha_desde),
        };
      }

      if (filtros.fecha_hasta) {
        where.fecha_movimiento = {
          ...where.fecha_movimiento,
          [db.Sequelize.Op.lte]: new Date(filtros.fecha_hasta),
        };
      }

      const comisiones = await db.movimientoReferencia.findAll({
        where,
        include: [
          {
            model: db.referido,
            as: "referido",
            attributes: [
              "id_referido",
              "nombre_referido",
              "apellido_referido",
              "empresa_referido",
            ],
          },
        ],
        order: [["fecha_movimiento", "DESC"]],
      });

      return comisiones;
    } catch (error) {
      logger.error("Error al obtener historial de comisiones:", error);
      throw error;
    }
  }

  /**
   * Obtiene resumen de comisiones de un referente
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Object>} Resumen
   */
  async obtenerResumenComisiones(id_referente) {
    try {
      const [pendientes, pagadas, vencidas, canceladas] = await Promise.all([
        db.movimientoReferencia.sum("monto_comision", {
          where: { id_referente, estado_comision: "pendiente" },
        }),
        db.movimientoReferencia.sum("monto_comision", {
          where: { id_referente, estado_comision: "pagada" },
        }),
        db.movimientoReferencia.sum("monto_comision", {
          where: { id_referente, estado_comision: "vencida" },
        }),
        db.movimientoReferencia.sum("monto_comision", {
          where: { id_referente, estado_comision: "cancelada" },
        }),
      ]);

      return {
        total_pendientes: pendientes || 0,
        total_pagadas: pagadas || 0,
        total_vencidas: vencidas || 0,
        total_canceladas: canceladas || 0,
        total_general: (pendientes || 0) + (pagadas || 0),
      };
    } catch (error) {
      logger.error("Error al obtener resumen de comisiones:", error);
      throw error;
    }
  }
}

export default new ComisionService();
