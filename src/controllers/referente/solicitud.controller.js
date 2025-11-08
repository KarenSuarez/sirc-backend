import db from "../../models/index.js";
import SaldoService from "../../services/saldo.service.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("solicitud.controller");

export const crearSolicitud = async (req, res) => {
  try {
    const id_referente = req.userId;

    const { metodo_retiro, monto_solicitado, cuenta_destino, banco_destino } =
      req.body;

    if (!metodo_retiro || !monto_solicitado) {
      return res.status(400).json({
        message: "Método de retiro y monto son requeridos",
      });
    }

    if (parseFloat(monto_solicitado) <= 0) {
      return res.status(400).json({
        message: "El monto debe ser mayor a cero",
      });
    }

    const tieneSaldo = await SaldoService.validarSaldoDisponible(
      id_referente,
      monto_solicitado
    );

    if (!tieneSaldo) {
      return res.status(400).json({
        message: "Saldo insuficiente para realizar la solicitud",
      });
    }

    const nuevaSolicitud = await db.solicitudRecompensa.create({
      id_referente,
      metodo_retiro,
      monto_solicitado: parseFloat(monto_solicitado),
      estado_solicitud: "pendiente",
      fecha_solicitud: new Date(),
      cuenta_destino: cuenta_destino || null,
      banco_destino: banco_destino || null,
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    logger.info(`Solicitud creada: ID ${nuevaSolicitud.id_solicitud}`);

    return res.status(201).json({
      message: "Solicitud creada exitosamente",
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    logger.error("Error en crearSolicitud:", error);
    return res.status(500).json({
      message: "Error al crear solicitud",
      error: error.message,
    });
  }
};

export const aprobarSolicitud = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const id_usuario = req.userId;
    const { comprobante_pago_url, observaciones } = req.body;

    const solicitud = await db.solicitudRecompensa.findByPk(id, {
      transaction,
    });

    if (!solicitud) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (solicitud.estado_solicitud !== "pendiente") {
      await transaction.rollback();
      return res.status(400).json({
        message: `La solicitud ya fue ${solicitud.estado_solicitud}`,
      });
    }

    if (solicitud.metodo_retiro === "retiro") {
      await SaldoService.registrarEgresoRetiro({
        id_referente: solicitud.id_referente,
        monto: parseFloat(solicitud.monto_solicitado),
        id_solicitud_recompensa: solicitud.id_solicitud,
        descripcion:
          observaciones ||
          `Retiro aprobado - Solicitud #${solicitud.id_solicitud}`,
        creado_por: id_usuario,
      });
    } else if (solicitud.metodo_retiro === "bono_pago") {
      await SaldoService.registrarEgresoBono({
        id_referente: solicitud.id_referente,
        monto: parseFloat(solicitud.monto_solicitado),
        id_solicitud_recompensa: solicitud.id_solicitud,
        descripcion:
          observaciones ||
          `Bono aplicado - Solicitud #${solicitud.id_solicitud}`,
        creado_por: id_usuario,
      });
    }

    await solicitud.update(
      {
        estado_solicitud: "aprobada",
        fecha_procesamiento: new Date(),
        id_usuario_procesa: id_usuario,
        comprobante_pago_url: comprobante_pago_url || null,
        actualizado_en: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    logger.info(
      `Solicitud aprobada: ID ${id}${comprobante_pago_url ? " (con comprobante)" : ""}`
    );

    return res.status(200).json({
      message: "Solicitud aprobada exitosamente",
      solicitud,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({
      message: "Error al aprobar solicitud",
      error: error.message,
    });
  }
};

export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.userId;
    const { observaciones } = req.body;

    const solicitud = await db.solicitudRecompensa.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (solicitud.estado_solicitud !== "pendiente") {
      return res.status(400).json({
        message: `La solicitud ya fue ${solicitud.estado_solicitud}`,
      });
    }

    await solicitud.update({
      estado_solicitud: "rechazada",
      fecha_procesamiento: new Date(),
      id_usuario_procesa: id_usuario,
      actualizado_en: new Date(),
    });

    logger.info(
      `Solicitud rechazada: ID ${id}${observaciones ? " - " + observaciones : ""}`
    );

    return res.status(200).json({
      message: "Solicitud rechazada",
      solicitud,
      observaciones: observaciones || null,
    });
  } catch (error) {
    logger.error("Error en rechazarSolicitud:", error);
    return res.status(500).json({
      message: "Error al rechazar solicitud",
      error: error.message,
    });
  }
};

export const listarSolicitudes = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const solicitudes = await db.solicitudRecompensa.findAll({
      where: { id_referente: id_usuario },
      include: [
        {
          model: db.usuario,
          as: "procesado_por",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      order: [["fecha_solicitud", "DESC"]],
    });

    return res.status(200).json(solicitudes);
  } catch (error) {
    logger.error("Error en listarSolicitudes:", error);
    return res.status(500).json({
      message: "Error al listar solicitudes",
      error: error.message,
    });
  }
};

export const listarTodasLasSolicitudes = async (req, res) => {
  try {
    const { estado, metodo_retiro, limite = 50, pagina = 1 } = req.query;

    const where = {};
    if (estado) {
      where.estado_solicitud = estado;
    }
    if (metodo_retiro) {
      where.metodo_retiro = metodo_retiro;
    }

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows } = await db.solicitudRecompensa.findAndCountAll({
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
                "numero_documento",
              ],
            },
          ],
        },
        {
          model: db.usuario,
          as: "procesado_por",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      order: [["fecha_solicitud", "DESC"]],
      limit: parseInt(limite),
      offset,
    });

    return res.status(200).json({
      total: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas: Math.ceil(count / parseInt(limite)),
      solicitudes: rows,
    });
  } catch (error) {
    logger.error("Error en listarTodasLasSolicitudes:", error);
    return res.status(500).json({
      message: "Error al listar solicitudes",
      error: error.message,
    });
  }
};

export const getSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.userId;

    const solicitud = await db.solicitudRecompensa.findByPk(id, {
      include: [
        {
          model: db.usuario,
          as: "procesado_por",
          attributes: ["nombre", "apellido"],
        },
        {
          model: db.referente,
          as: "referente",
          include: [
            {
              model: db.usuario,
              as: "usuario",
              attributes: ["nombre", "apellido"],
            },
          ],
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    const usuario = await db.usuario.findByPk(id_usuario, {
      include: [
        {
          model: db.rol,
          as: "roles",
          attributes: ["codigo_rol"],
          through: { attributes: [] },
        },
      ],
    });

    const esContadorOAdmin = usuario.roles.some(
      (rol) => rol.codigo_rol === "CONTADOR" || rol.codigo_rol === "ADMIN"
    );

    if (!esContadorOAdmin && solicitud.id_referente !== id_usuario) {
      return res.status(403).json({
        message: "No tienes permiso para ver esta solicitud",
      });
    }

    return res.status(200).json(solicitud);
  } catch (error) {
    logger.error("Error en getSolicitud:", error);
    return res.status(500).json({
      message: "Error al obtener solicitud",
      error: error.message,
    });
  }
};

export default {
  crearSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
  listarSolicitudes,
  listarTodasLasSolicitudes,
  getSolicitud,
};
