import db from "../models/index.js";
import createLogger from "../utils/logger.js";

const logger = createLogger("saldo.service.js");

class SaldoService {
  /**
   * Registra un ingreso de comisión
   * @param {Object} params - Parámetros del ingreso
   * @returns {Promise<Object>} Movimiento de saldo creado
   */
  async registrarIngresoComision(params) {
    const transaction = await db.sequelize.transaction();

    try {
      const {
        id_referente,
        monto,
        puntos,
        id_movimiento_referencia = null,
        descripcion = "Ingreso por comisión",
        creado_por = null,
      } = params;

      const referente = await db.referente.findByPk(id_referente, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const saldo_anterior = parseFloat(referente.saldo_disponible);
      const puntos_anteriores = referente.puntos_actuales;

      const saldo_nuevo = saldo_anterior + parseFloat(monto);
      const puntos_nuevos = puntos_anteriores + puntos;

      const movimientoSaldo = await db.movimientoSaldo.create(
        {
          id_referente,
          tipo_movimiento: "ingreso_comision",
          monto: parseFloat(monto),
          saldo_anterior,
          saldo_nuevo,
          puntos_otorgados: puntos,
          puntos_anteriores,
          puntos_nuevos,
          descripcion,
          id_movimiento_referencia,
          creado_por,
          fecha_movimiento: new Date(),
        },
        { transaction }
      );

      await referente.update(
        {
          saldo_disponible: saldo_nuevo,
          puntos_actuales: puntos_nuevos,
          puntos_totales_historico: referente.puntos_totales_historico + puntos,
          total_comisiones_historico:
            referente.total_comisiones_historico + parseFloat(monto),
        },
        { transaction }
      );

      await transaction.commit();
      return movimientoSaldo;
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al registrar ingreso de comisión:", error);
      throw error;
    }
  }

  /**
   * Registra un ajuste negativo (cancelación de comisión)
   * @param {Object} params - Parámetros del ajuste
   * @returns {Promise<Object>} Movimiento de saldo creado
   */
  async registrarAjusteNegativo(params) {
    const transaction = await db.sequelize.transaction();

    try {
      const {
        id_referente,
        monto,
        puntos,
        id_movimiento_referencia,
        descripcion,
        creado_por = null,
      } = params;

      const referente = await db.referente.findByPk(id_referente, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const saldo_anterior = parseFloat(referente.saldo_disponible);
      const puntos_anteriores = referente.puntos_actuales;

      const saldo_nuevo = saldo_anterior - parseFloat(monto);
      const puntos_nuevos = puntos_anteriores - puntos;

      const movimientoSaldo = await db.movimientoSaldo.create(
        {
          id_referente,
          tipo_movimiento: "ajuste_negativo",
          monto: -parseFloat(monto),
          saldo_anterior,
          saldo_nuevo,
          puntos_otorgados: -puntos,
          puntos_anteriores,
          puntos_nuevos,
          descripcion,
          id_movimiento_referencia,
          creado_por,
          fecha_movimiento: new Date(),
        },
        { transaction }
      );

      await referente.update(
        {
          saldo_disponible: saldo_nuevo,
          puntos_actuales: puntos_nuevos,
          puntos_totales_historico: referente.puntos_totales_historico - puntos,
          total_comisiones_historico:
            referente.total_comisiones_historico - parseFloat(monto),
        },
        { transaction }
      );

      await transaction.commit();
      return movimientoSaldo;
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al registrar ajuste negativo:", error);
      throw error;
    }
  }

  /**
   * Registra un retiro de saldo
   * @param {Object} params - Parámetros del retiro
   * @returns {Promise<Object>} Movimiento de saldo creado
   */
  async registrarRetiro(params) {
    const transaction = await db.sequelize.transaction();

    try {
      const {
        id_referente,
        monto,
        descripcion = "Retiro de saldo",
        id_solicitud_retiro = null,
        creado_por = null,
      } = params;

      const referente = await db.referente.findByPk(id_referente, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const saldo_anterior = parseFloat(referente.saldo_disponible);
      const montoRetiro = parseFloat(monto);

      if (saldo_anterior < montoRetiro) {
        throw new Error("Saldo insuficiente");
      }

      const saldo_nuevo = saldo_anterior - montoRetiro;

      const movimientoSaldo = await db.movimientoSaldo.create(
        {
          id_referente,
          tipo_movimiento: "retiro",
          monto: -montoRetiro,
          saldo_anterior,
          saldo_nuevo,
          puntos_otorgados: 0,
          puntos_anteriores: referente.puntos_actuales,
          puntos_nuevos: referente.puntos_actuales,
          descripcion,
          id_solicitud_retiro,
          creado_por,
          fecha_movimiento: new Date(),
        },
        { transaction }
      );

      await referente.update(
        {
          saldo_disponible: saldo_nuevo,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(
        `Retiro de ${montoRetiro} registrado para referente ${id_referente}`
      );
      return movimientoSaldo;
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al registrar retiro:", error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de movimientos de saldo
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Array>} Historial de movimientos
   */
  async obtenerHistorialSaldo(id_referente) {
    try {
      const historial = await db.movimientoSaldo.findAll({
        where: { id_referente },
        order: [["fecha_movimiento", "DESC"]],
      });
      return historial;
    } catch (error) {
      logger.error("Error al obtener historial de saldo:", error);
      throw error;
    }
  }

  /**
   * Valida si el referente tiene saldo suficiente
   * @param {number} id_referente - ID del referente
   * @param {number} monto - Monto a validar
   * @returns {Promise<boolean>} True si tiene saldo suficiente
   */
  async validarSaldoDisponible(id_referente, monto) {
    try {
      const referente = await db.referente.findByPk(id_referente);

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      const saldo_actual = parseFloat(referente.saldo_disponible);
      return saldo_actual >= parseFloat(monto);
    } catch (error) {
      logger.error("Error al validar saldo:", error);
      throw error;
    }
  }

  /**
   * Obtiene el saldo actual de un referente
   * @param {number} id_referente - ID del referente
   * @returns {Promise<Object>} Información del saldo
   */
  async obtenerSaldoActual(id_referente) {
    try {
      const referente = await db.referente.findByPk(id_referente);

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      return {
        saldo_disponible: parseFloat(referente.saldo_disponible),
        puntos_actuales: referente.puntos_actuales,
        puntos_totales_historico: referente.puntos_totales_historico,
        total_comisiones_historico: parseFloat(
          referente.total_comisiones_historico
        ),
      };
    } catch (error) {
      logger.error("Error al obtener saldo actual:", error);
      throw error;
    }
  }
}

export default new SaldoService();