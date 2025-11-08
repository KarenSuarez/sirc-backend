import db from "../../models/index.js";
import ComisionService from "../../services/comision.service.js";
import SaldoService from "../../services/saldo.service.js";
import NivelService from "../../services/nivel.service.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("referente.controller");

export const getPerfil = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const referente = await db.referente.findByPk(id_usuario, {
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
            "fecha_registro",
          ],
        },
      ],
    });

    if (!referente) {
      return res.status(404).json({
        message: "Perfil de referente no encontrado",
      });
    }

    const nivelActual = await NivelService.obtenerNivelActual(id_usuario);
    const progresoNivel = await NivelService.calcularProgresoNivel(id_usuario);

    return res.status(200).json({
      referente,
      nivel: nivelActual,
      progreso: progresoNivel,
    });
  } catch (error) {
    logger.error("Error en getPerfil:", error);
    return res.status(500).json({
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
};

export const getSaldo = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const saldo = await SaldoService.obtenerSaldoActual(id_usuario);

    return res.status(200).json(saldo);
  } catch (error) {
    logger.error("Error en getSaldo:", error);
    return res.status(500).json({
      message: "Error al obtener saldo",
      error: error.message,
    });
  }
};

export const getComisiones = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { estado, fecha_desde, fecha_hasta } = req.query;

    const filtros = {};
    if (estado) filtros.estado_comision = estado;
    if (fecha_desde) filtros.fecha_desde = fecha_desde;
    if (fecha_hasta) filtros.fecha_hasta = fecha_hasta;

    const comisiones = await ComisionService.obtenerHistorialComisiones(
      id_usuario,
      filtros
    );

    return res.status(200).json(comisiones);
  } catch (error) {
    logger.error("Error en getComisiones:", error);
    return res.status(500).json({
      message: "Error al obtener comisiones",
      error: error.message,
    });
  }
};

export const getResumenComisiones = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const resumen = await ComisionService.obtenerResumenComisiones(id_usuario);

    return res.status(200).json(resumen);
  } catch (error) {
    logger.error("Error en getResumenComisiones:", error);
    return res.status(500).json({
      message: "Error al obtener resumen",
      error: error.message,
    });
  }
};

export const getMovimientosSaldo = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { tipo_movimiento, fecha_desde, fecha_hasta } = req.query;

    const filtros = {};
    if (tipo_movimiento) filtros.tipo_movimiento = tipo_movimiento;
    if (fecha_desde) filtros.fecha_desde = fecha_desde;
    if (fecha_hasta) filtros.fecha_hasta = fecha_hasta;

    const movimientos = await SaldoService.obtenerHistorialSaldo(
      id_usuario,
      filtros
    );

    return res.status(200).json(movimientos);
  } catch (error) {
    logger.error("Error en getMovimientosSaldo:", error);
    return res.status(500).json({
      message: "Error al obtener movimientos",
      error: error.message,
    });
  }
};

export const getNivel = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const nivelActual = await NivelService.obtenerNivelActual(id_usuario);
    const progreso = await NivelService.calcularProgresoNivel(id_usuario);
    const historial = await NivelService.obtenerHistorialNiveles(id_usuario);

    return res.status(200).json({
      nivel_actual: nivelActual,
      progreso,
      historial,
    });
  } catch (error) {
    logger.error("Error en getNivel:", error);
    return res.status(500).json({
      message: "Error al obtener nivel",
      error: error.message,
    });
  }
};

export const getReferidos = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { estado } = req.query;

    const where = { id_referente: id_usuario };
    if (estado) {
      where.estado_referido = estado;
    }

    const referidos = await db.referido.findAll({
      where,
      include: [
        {
          model: db.plan,
          as: "plan",
          attributes: ["id_plan", "nombre_plan", "precio_actual", "icono_plan"],
        },
        {
          model: db.tipoDocumento,
          as: "tipoDocumento",
          attributes: ["nombre_tipo", "codigo_tipo"],
        },
      ],
      order: [["creado_en", "DESC"]],
    });

    return res.status(200).json(referidos);
  } catch (error) {
    logger.error("Error en getReferidos:", error);
    return res.status(500).json({
      message: "Error al obtener referidos",
      error: error.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const [
      referente,
      nivelActual,
      progresoNivel,
      resumenComisiones,
      totalReferidos,
      referidosActivos,
      referidosPendientes,
      ultimosReferidos,
    ] = await Promise.all([
      db.referente.findByPk(id_usuario),
      NivelService.obtenerNivelActual(id_usuario),
      NivelService.calcularProgresoNivel(id_usuario),
      ComisionService.obtenerResumenComisiones(id_usuario),
      db.referido.count({ where: { id_referente: id_usuario } }),
      db.referido.count({
        where: { id_referente: id_usuario, estado_referido: "activo" },
      }),
      db.referido.count({
        where: { id_referente: id_usuario, estado_referido: "pendiente" },
      }),
      db.referido.findAll({
        where: { id_referente: id_usuario },
        limit: 5,
        order: [["creado_en", "DESC"]],
        include: [
          {
            model: db.plan,
            as: "plan",
            attributes: ["nombre_plan"],
          },
        ],
      }),
    ]);

    return res.status(200).json({
      saldo: {
        saldo_disponible: parseFloat(referente.saldo_disponible),
        total_comisiones_historico: parseFloat(
          referente.total_comisiones_historico
        ),
        total_retirado: parseFloat(referente.total_retirado),
      },
      puntos: {
        puntos_actuales: referente.puntos_actuales,
        puntos_totales_historico: referente.puntos_totales_historico,
      },
      nivel: {
        actual: nivelActual,
        progreso: progresoNivel,
      },
      comisiones: resumenComisiones,
      referidos: {
        total: totalReferidos,
        activos: referidosActivos,
        pendientes: referidosPendientes,
        ultimos: ultimosReferidos,
      },
      estado_referente: referente.estado_referente,
      codigo_referente: referente.codigo_referente,
      tipo_referente: referente.tipo_referente,
      fecha_ultima_actividad: referente.fecha_ultima_actividad,
    });
  } catch (error) {
    logger.error("Error en getDashboard:", error);
    return res.status(500).json({
      message: "Error al obtener dashboard",
      error: error.message,
    });
  }
};

export const getEstadisticas = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { periodo = "mes" } = req.query;
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

    const [referidosCreados, comisionesGeneradas, puntosGanados] =
      await Promise.all([
        db.referido.count({
          where: {
            id_referente: id_usuario,
            creado_en: {
              [db.Sequelize.Op.between]: [fechaInicio, fechaFin],
            },
          },
        }),
        db.movimientoReferencia.sum("monto_comision", {
          where: {
            id_referente: id_usuario,
            fecha_movimiento: {
              [db.Sequelize.Op.between]: [fechaInicio, fechaFin],
            },
          },
        }),
        db.movimientoReferencia.sum("puntos_otorgados", {
          where: {
            id_referente: id_usuario,
            fecha_movimiento: {
              [db.Sequelize.Op.between]: [fechaInicio, fechaFin],
            },
          },
        }),
      ]);

    return res.status(200).json({
      periodo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      referidos_creados: referidosCreados,
      comisiones_generadas: comisionesGeneradas || 0,
      puntos_ganados: puntosGanados || 0,
    });
  } catch (error) {
    logger.error("Error en getEstadisticas:", error);
    return res.status(500).json({
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

export default {
  getPerfil,
  getSaldo,
  getComisiones,
  getResumenComisiones,
  getMovimientosSaldo,
  getNivel,
  getReferidos,
  getDashboard,
  getEstadisticas,
};