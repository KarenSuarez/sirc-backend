import db from "../../models/index.js";
import ComisionService from "../../services/comision.service.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("asesor.controller");

export const listarTodosLosReferidos = async (req, res) => {
  try {
    const { estado, limite = 50, pagina = 1 } = req.query;

    const where = {};
    if (estado) {
      where.estado_referido = estado;
    }

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows } = await db.referido.findAndCountAll({
      where,
      include: [
        {
          model: db.referente,
          as: "referente",
          include: [
            {
              model: db.usuario,
              as: "usuario",
              attributes: [
                "nombre",
                "apellido",
                "correo_electronico",
                "telefono",
              ],
            },
          ],
        },
        {
          model: db.plan,
          as: "plan",
          attributes: ["nombre_plan", "precio_actual"],
        },
        {
          model: db.tipoDocumento,
          as: "tipoDocumento",
          attributes: ["nombre_tipo", "codigo_tipo"],
        },
        {
          model: db.usuario,
          as: "asesorVendedor",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      order: [["creado_en", "DESC"]],
      limit: parseInt(limite),
      offset,
    });

    return res.status(200).json({
      total: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas: Math.ceil(count / parseInt(limite)),
      referidos: rows,
    });
  } catch (error) {
    logger.error("Error en listarTodosLosReferidos:", error);
    return res.status(500).json({
      message: "Error al listar referidos",
      error: error.message,
    });
  }
};

export const obtenerDetalleReferido = async (req, res) => {
  try {
    const { id } = req.params;

    const referido = await db.referido.findByPk(id, {
      include: [
        {
          model: db.referente,
          as: "referente",
          include: [
            {
              model: db.usuario,
              as: "usuario",
              attributes: [
                "nombre",
                "apellido",
                "correo_electronico",
                "telefono",
              ],
            },
          ],
        },
        {
          model: db.plan,
          as: "plan",
        },
        {
          model: db.tipoDocumento,
          as: "tipoDocumento",
        },
        {
          model: db.usuario,
          as: "asesorVendedor",
          attributes: ["nombre", "apellido", "correo_electronico"],
          required: false,
        },
      ],
    });

    if (!referido) {
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    return res.status(200).json(referido);
  } catch (error) {
    logger.error("Error en obtenerDetalleReferido:", error);
    return res.status(500).json({
      message: "Error al obtener referido",
      error: error.message,
    });
  }
};

export const convertirReferidoPorAsesor = async (req, res) => {
  let transaction;

  try {
    const { id } = req.params;
    const id_asesor = req.userId;
    const { id_plan_adquirido } = req.body;

    if (!id_plan_adquirido) {
      return res.status(400).json({
        message: "El ID del plan es requerido",
      });
    }

    transaction = await db.sequelize.transaction();

    const referido = await db.referido.findByPk(id, { transaction });

    if (!referido) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    if (referido.estado_referido === "activo") {
      await transaction.rollback();
      return res.status(400).json({
        message: "El referido ya fue convertido anteriormente",
      });
    }

    const plan = await db.plan.findByPk(id_plan_adquirido, { transaction });

    if (!plan) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Plan no encontrado",
      });
    }

    // Actualizar el referido
    await referido.update(
      {
        estado_referido: "activo",
        id_plan_adquirido,
        id_asesor_vendedor: id_asesor,
        fecha_conversion: new Date(),
        actualizado_en: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    logger.info("Transacción de referido completada");

    // Procesar comisión DESPUÉS del commit
    const resultadoComision = await ComisionService.procesarComisionCompleta({
      id_referente: referido.id_referente,
      id_referido: referido.id_referido,
      id_plan: id_plan_adquirido,
      id_usuario_procesa: id_asesor,
      pagar_inmediatamente: true, // ← La comisión se paga inmediatamente
    });

    // Recargar el referido con todas las relaciones para la respuesta
    const referidoCompleto = await db.referido.findByPk(id, {
      include: [
        {
          model: db.plan,
          as: "plan",
          attributes: ["id_plan", "nombre_plan", "precio_actual", "icono_plan", "color_plan"],
        },
        {
          model: db.referente,
          as: "referente",
          attributes: ["codigo_referente"],
          include: [
            {
              model: db.usuario,
              as: "usuario",
              attributes: ["nombre", "apellido", "correo_electronico"],
            },
          ],
        },
        {
          model: db.usuario,
          as: "asesorVendedor",
          attributes: ["nombre", "apellido"],
        },
      ],
    });

    logger.info(`Referido convertido por asesor ${id_asesor}: ID ${id}`);

    return res.status(200).json({
      message: "Referido convertido y comisión procesada exitosamente",
      referido: referidoCompleto,
      comision: {
        ...resultadoComision.comision,
        estado: resultadoComision.movimiento_referencia.estado_comision,
        id_movimiento: resultadoComision.movimiento_referencia.id_movimiento,
      },
      asesor_vendedor: {
        id_usuario: id_asesor,
        mensaje: "Venta registrada a tu nombre",
      },
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
        logger.warn("Rollback ejecutado");
      } catch (rollbackError) {
        logger.error("Error en rollback:", rollbackError);
      }
    }

    logger.error("Error en convertirReferidoPorAsesor:", error);
    return res.status(500).json({
      message: "Error al convertir referido",
      error: error.message,
    });
  }
};

export const actualizarEstadoReferido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_referido, observaciones } = req.body;

    const referido = await db.referido.findByPk(id);

    if (!referido) {
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    await referido.update({
      estado_referido: estado_referido || referido.estado_referido,
      observaciones: observaciones || referido.observaciones,
      actualizado_en: new Date(),
    });

    logger.info(
      `Estado de referido actualizado: ID ${id} a ${estado_referido}`
    );

    return res.status(200).json({
      message: "Estado actualizado exitosamente",
      referido,
    });
  } catch (error) {
    logger.error("Error en actualizarEstadoReferido:", error);
    return res.status(500).json({
      message: "Error al actualizar estado",
      error: error.message,
    });
  }
};

export const actualizarInformacionReferido = async (req, res) => {
  try {
    const { id } = req.params;

    const referido = await db.referido.findByPk(id);

    if (!referido) {
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    const {
      nombre_referido,
      apellido_referido,
      correo_referido,
      telefono_referido,
      empresa_referido,
      cargo_referido,
      observaciones,
    } = req.body;

    await referido.update({
      nombre_referido: nombre_referido || referido.nombre_referido,
      apellido_referido: apellido_referido || referido.apellido_referido,
      correo_referido: correo_referido || referido.correo_referido,
      telefono_referido: telefono_referido || referido.telefono_referido,
      empresa_referido: empresa_referido || referido.empresa_referido,
      cargo_referido: cargo_referido || referido.cargo_referido,
      observaciones: observaciones || referido.observaciones,
      actualizado_en: new Date(),
    });

    logger.info(`Información de referido actualizada: ID ${id}`);

    return res.status(200).json({
      message: "Referido actualizado exitosamente",
      referido,
    });
  } catch (error) {
    logger.error("Error en actualizarInformacionReferido:", error);
    return res.status(500).json({
      message: "Error al actualizar referido",
      error: error.message,
    });
  }
};

export const registrarPrimerContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body;

    const referido = await db.referido.findByPk(id);

    if (!referido) {
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    await referido.update({
      estado_referido: "contactado",
      fecha_primer_contacto: new Date(),
      observaciones: observaciones || referido.observaciones,
      actualizado_en: new Date(),
    });

    logger.info(`Primer contacto registrado: ID ${id}`);

    return res.status(200).json({
      message: "Contacto registrado exitosamente",
      referido,
    });
  } catch (error) {
    logger.error("Error en registrarPrimerContacto:", error);
    return res.status(500).json({
      message: "Error al registrar contacto",
      error: error.message,
    });
  }
};

export const listarReferentes = async (req, res) => {
  try {
    const { limite = 50, pagina = 1 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows } = await db.referente.findAndCountAll({
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: [
            "nombre",
            "apellido",
            "correo_electronico",
            "telefono",
            "numero_documento",
          ],
        },
      ],
      limit: parseInt(limite),
      offset,
      order: [["creado_en", "DESC"]],
    });

    const referentesConMetricas = await Promise.all(
      rows.map(async (referente) => {
        const totalReferidos = await db.referido.count({
          where: { id_referente: referente.id_usuario },
        });

        const referidosActivos = await db.referido.count({
          where: {
            id_referente: referente.id_usuario,
            estado_referido: "activo",
          },
        });

        return {
          ...referente.toJSON(),
          metricas: {
            total_referidos: totalReferidos,
            referidos_activos: referidosActivos,
          },
        };
      })
    );

    return res.status(200).json({
      total: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas: Math.ceil(count / parseInt(limite)),
      referentes: referentesConMetricas,
    });
  } catch (error) {
    logger.error("Error en listarReferentes:", error);
    return res.status(500).json({
      message: "Error al listar referentes",
      error: error.message,
    });
  }
};

export const obtenerDetalleReferente = async (req, res) => {
  try {
    const { id } = req.params;

    const referente = await db.referente.findByPk(id, {
      include: [
        {
          model: db.usuario,
          as: "usuario",
        },
      ],
    });

    if (!referente) {
      return res.status(404).json({
        message: "Referente no encontrado",
      });
    }

    const totalReferidos = await db.referido.count({
      where: { id_referente: id },
    });

    const referidosActivos = await db.referido.count({
      where: { id_referente: id, estado_referido: "activo" },
    });

    return res.status(200).json({
      ...referente.toJSON(),
      metricas: {
        total_referidos: totalReferidos,
        referidos_activos: referidosActivos,
      },
    });
  } catch (error) {
    logger.error("Error en obtenerDetalleReferente:", error);
    return res.status(500).json({
      message: "Error al obtener referente",
      error: error.message,
    });
  }
};

export const listarReferidosPorReferente = async (req, res) => {
  try {
    const { id } = req.params;

    const referidos = await db.referido.findAll({
      where: { id_referente: id },
      include: [
        {
          model: db.plan,
          as: "plan",
        },
        {
          model: db.usuario,
          as: "asesorVendedor",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      order: [["creado_en", "DESC"]],
    });

    return res.status(200).json(referidos);
  } catch (error) {
    logger.error("Error en listarReferidosPorReferente:", error);
    return res.status(500).json({
      message: "Error al listar referidos",
      error: error.message,
    });
  }
};

export const obtenerMisEstadisticas = async (req, res) => {
  try {
    const id_asesor = req.userId;

    const referidosConvertidos = await db.referido.count({
      where: {
        id_asesor_vendedor: id_asesor,
        estado_referido: "activo",
      },
    });

    const comisionesGeneradas = await db.movimientoReferencia.sum(
      "monto_comision",
      {
        include: [
          {
            model: db.referido,
            as: "referido",
            where: { id_asesor_vendedor: id_asesor },
            attributes: [],
          },
        ],
      }
    );

    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const conversionesUltimos30Dias = await db.referido.count({
      where: {
        id_asesor_vendedor: id_asesor,
        estado_referido: "activo",
        fecha_conversion: {
          [db.Sequelize.Op.gte]: hace30Dias,
        },
      },
    });

    return res.status(200).json({
      referidos_convertidos_total: referidosConvertidos,
      comisiones_generadas_total: parseFloat(comisionesGeneradas || 0),
      conversiones_ultimos_30_dias: conversionesUltimos30Dias,
    });
  } catch (error) {
    logger.error("Error en obtenerMisEstadisticas:", error);
    return res.status(500).json({
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

export default {
  listarTodosLosReferidos,
  obtenerDetalleReferido,
  convertirReferidoPorAsesor,
  actualizarEstadoReferido,
  actualizarInformacionReferido,
  registrarPrimerContacto,
  listarReferentes,
  obtenerDetalleReferente,
  listarReferidosPorReferente,
  obtenerMisEstadisticas,
};
