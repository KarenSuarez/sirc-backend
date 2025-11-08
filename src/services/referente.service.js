import db from "../models/index.js";
import createLogger from "./logger.js";

const logger = createLogger("referente.service.js");

class ReferenteService {
  /**
   * Crear perfil de referente para un usuario
   * @param {number} id_usuario - ID del usuario
   * @param {Object} datos - Datos adicionales del referente
   * @returns {Promise<Object>} Referente creado
   */
  async crearPerfilReferente(id_usuario, datos = {}) {
    const transaction = await db.sequelize.transaction();

    try {
      const usuario = await db.usuario.findByPk(id_usuario, { transaction });

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }
      const referenciaExistente = await db.referente.findByPk(id_usuario, {
        transaction,
      });

      if (referenciaExistente) {
        throw new Error("El usuario ya tiene un perfil de referente");
      }

      const codigo_referente = `REF-${String(id_usuario).padStart(6, "0")}`;

      const nuevoReferente = await db.referente.create(
        {
          id_usuario,
          codigo_referente,
          tipo_referente: datos.tipo_referente || "cliente_externo",
          puntos_actuales: 0,
          puntos_totales_historico: 0,
          estado_referente: "activo",
          fecha_creacion: new Date(),
          fecha_ultima_actividad: new Date(),
        },
        { transaction }
      );

      const rolReferente = await db.rol.findOne({
        where: { codigo_rol: "REF" },
        transaction,
      });
      if (rolReferente) {
        await usuario.addRol(rolReferente, { transaction });
      } else {
        logger.warn(
          "No se encontró el ROL 'REF'. El usuario no fue asignado a este rol."
        );
      }

      const nivelBronce = await db.nivel.findOne({
        where: { orden_nivel: 1 },
        transaction,
      });
      if (nivelBronce) {
        await db.historialNivel.create(
          {
            id_referente: id_usuario,
            id_nivel_nuevo: nivelBronce.id_nivel,
            puntos_al_momento: 0,
            fecha_cambio: new Date(),
            activo: true,
          },
          { transaction }
        );
      } else {
        logger.warn(
          "No se encontró el Nivel inicial (orden_nivel: 1). No se asignó historial de nivel."
        );
      }

      await transaction.commit();

      logger.info(
        `Perfil de referente creado exitosamente para usuario ID: ${id_usuario}`
      );
      return nuevoReferente;
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al crear perfil de referente:", error);
      throw error;
    }
  }

  /**
   * Obtener el perfil completo de un referente
   * @param {number} id_usuario - ID del usuario referente
   * @returns {Promise<Object>} Perfil completo
   */
  async getPerfilReferente(id_usuario) {
    try {
      const referente = await db.referente.findOne({
        where: { id_usuario },
        include: [
          {
            model: db.usuario,
            as: "usuario",
            attributes: { exclude: ["contrasena", "token_recuperacion"] },
          },
        ],
      });

      if (!referente) {
        throw new Error("Perfil de referente no encontrado");
      }

      return referente;
    } catch (error) {
      logger.error("Error al obtener perfil de referente:", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del dashboard de un referente
   * @param {number} id_usuario - ID del usuario referente
   * @returns {Promise<Object>} Estadísticas
   */
  async getDashboardStats(id_usuario) {
    try {
      const [
        totalReferidos,
        referidosPendientes,
        referidosConvertidos,
        comisionesPendientes,
        comisionesPagadas,
        puntosActuales,
        ranking,
      ] = await Promise.all([
        db.referido.count({ where: { id_referente: id_usuario } }),
        db.referido.count({
          where: { id_referente: id_usuario, estado_referido: "pendiente" },
        }),
        db.referido.count({
          where: { id_referente: id_usuario, estado_referido: "convertido" },
        }),
        db.movimientoReferencia.sum("monto_comision", {
          where: { id_referente: id_usuario, estado_comision: "pendiente" },
        }),
        db.movimientoReferencia.sum("monto_comision", {
          where: { id_referente: id_usuario, estado_comision: "pagada" },
        }),
        db.referente.findByPk(id_usuario, {
          attributes: ["puntos_actuales"],
        }),
        db.referente.findAll({
          attributes: [
            "id_usuario",
            "puntos_actuales",
            [
              db.sequelize.literal(
                'RANK() OVER (ORDER BY "puntos_actuales" DESC)'
              ),
              "rank",
            ],
          ],
          where: { estado_referente: "activo" },
        }),
      ]);

      const miRank = ranking.find((r) => r.id_usuario === id_usuario);

      return {
        total_referidos: totalReferidos || 0,
        referidos_pendientes: referidosPendientes || 0,
        referidos_convertidos: referidosConvertidos || 0,
        comisiones_pendientes: comisionesPendientes || 0,
        comisiones_pagadas: comisionesPagadas || 0,
        puntos_actuales: puntosActuales?.puntos_actuales || 0,
        ranking_puntos: miRank ? parseInt(miRank.get("rank"), 10) : null,
        total_referentes_activos: ranking.length,
      };
    } catch (error) {
      logger.error("Error al obtener estadísticas:", error);
      throw error;
    }
  }

  /**
   * Actualizar última actividad de un referente
   * @param {number} id_usuario - ID del usuario referente
   * @returns {Promise<Object>} Referente actualizado
   */
  async actualizarUltimaActividad(id_usuario) {
    try {
      const referente = await db.referente.findByPk(id_usuario);

      if (!referente) {
        throw new Error("Referente no encontrado");
      }

      await referente.update({
        fecha_ultima_actividad: new Date(),
      });

      return referente;
    } catch (error) {
      logger.error("Error al actualizar última actividad:", error);
      throw error;
    }
  }

  /**
   * Buscar referente por código
   * @param {string} codigo_referente - Código del referente
   * @returns {Promise<Object>} Referente encontrado
   */
  async buscarPorCodigo(codigo_referente) {
    try {
      const referente = await db.referente.findOne({
        where: { codigo_referente },
        include: [
          {
            model: db.usuario,
            as: "usuario",
            attributes: ["nombre", "apellido", "correo_electronico"],
          },
        ],
      });

      return referente;
    } catch (error) {
      logger.error("Error al buscar referente por código:", error);
      throw error;
    }
  }
}

export default new ReferenteService();