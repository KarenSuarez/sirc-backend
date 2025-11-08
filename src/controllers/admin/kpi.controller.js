import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("kpi.controller");

export const obtenerKPIsGenerales = async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalReferentes,
      referentesActivos,
      totalReferidos,
      referidosActivos,
      totalComisiones,
      comisionesPendientes,
      comisionesPagadas,
      totalSolicitudes,
      solicitudesPendientes,
    ] = await Promise.all([
      db.usuario.count(),
      db.referente.count(),
      db.referente.count({ where: { estado_referente: "activo" } }),
      db.referido.count(),
      db.referido.count({ where: { estado_referido: "activo" } }),
      db.movimientoReferencia.sum("monto_comision"),
      db.movimientoReferencia.sum("monto_comision", {
        where: { estado_comision: "pendiente" },
      }),
      db.movimientoReferencia.sum("monto_comision", {
        where: { estado_comision: "pagada" },
      }),

      db.solicitudRecompensa.count(),
      db.solicitudRecompensa.count({
        where: { estado_solicitud: "pendiente" },
      }),
    ]);

    return res.status(200).json({
      usuarios: {
        total: totalUsuarios,
        referentes: {
          total: totalReferentes,
          activos: referentesActivos,
          inactivos: totalReferentes - referentesActivos,
        },
      },
      referidos: {
        total: totalReferidos,
        activos: referidosActivos,
        pendientes: totalReferidos - referidosActivos,
      },
      comisiones: {
        total: parseFloat(totalComisiones || 0),
        pendientes: parseFloat(comisionesPendientes || 0),
        pagadas: parseFloat(comisionesPagadas || 0),
      },
      solicitudes: {
        total: totalSolicitudes,
        pendientes: solicitudesPendientes,
        procesadas: totalSolicitudes - solicitudesPendientes,
      },
    });
  } catch (error) {
    logger.error("Error en obtenerKPIsGenerales:", error);
    return res.status(500).json({
      message: "Error al obtener KPIs generales",
      error: error.message,
    });
  }
};

export const obtenerKPIsReferentes = async (req, res) => {
  try {
    const topPorPuntos = await db.referente.findAll({
      attributes: [
        "id_usuario",
        "codigo_referente",
        "puntos_actuales",
        "puntos_totales_historico",
      ],
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: ["nombre", "apellido"],
        },
      ],
      order: [["puntos_actuales", "DESC"]],
      limit: 10,
    });

    const topPorComisiones = await db.referente.findAll({
      attributes: [
        "id_usuario",
        "codigo_referente",
        "total_comisiones_historico",
        "saldo_disponible",
      ],
      include: [
        {
          model: db.usuario,
          as: "usuario",
          attributes: ["nombre", "apellido"],
        },
      ],
      order: [["total_comisiones_historico", "DESC"]],
      limit: 10,
    });

    const topPorReferidos = await db.sequelize.query(
      `
      SELECT 
        r.id_usuario,
        r.codigo_referente,
        u.nombre,
        u.apellido,
        COUNT(ref.id_referido) as total_referidos
      FROM Referente r
      INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
      LEFT JOIN Referido ref ON r.id_usuario = ref.id_referente AND ref.estado_referido = :estado
      GROUP BY r.id_usuario, r.codigo_referente, u.nombre, u.apellido
      ORDER BY total_referidos DESC
      LIMIT :limite
      `,
      {
        replacements: { estado: "activo", limite: 10 },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const distribucionNiveles = await db.sequelize.query(
      `
      SELECT 
        n.nombre_nivel,
        n.color_nivel,
        COUNT(DISTINCT hn.id_referente) as cantidad_referentes
      FROM Nivel n
      LEFT JOIN HistorialNivel hn ON n.id_nivel = hn.id_nivel_nuevo AND hn.activo = :activo
      GROUP BY n.id_nivel, n.nombre_nivel, n.color_nivel, n.orden_nivel
      ORDER BY n.orden_nivel ASC
      `,
      {
        replacements: { activo: true },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      top_puntos: topPorPuntos,
      top_comisiones: topPorComisiones,
      top_referidos: topPorReferidos,
      distribucion_niveles: distribucionNiveles,
    });
  } catch (error) {
    logger.error("Error en obtenerKPIsReferentes:", error);
    return res.status(500).json({
      message: "Error al obtener KPIs de referentes",
      error: error.message,
    });
  }
};

export const obtenerKPIsComisiones = async (req, res) => {
  try {
    const comisionesPorEstado = await db.movimientoReferencia.findAll({
      attributes: [
        "estado_comision",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("id_movimiento")),
          "cantidad",
        ],
        [
          db.sequelize.fn("SUM", db.sequelize.col("monto_comision")),
          "monto_total",
        ],
      ],
      group: ["estado_comision"],
    });

    const comisionesPorPlan = await db.sequelize.query(
      `
      SELECT 
        p.nombre_plan,
        COUNT(mr.id_movimiento) as cantidad_comisiones,
        SUM(mr.monto_comision) as monto_total,
        AVG(mr.monto_comision) as promedio_comision
      FROM MovimientoReferencia mr
      INNER JOIN Referido ref ON mr.id_referido = ref.id_referido
      INNER JOIN Plan p ON ref.id_plan_adquirido = p.id_plan
      GROUP BY p.id_plan, p.nombre_plan
      ORDER BY monto_total DESC
      `,
      {
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const comisionesUltimos30Dias = await db.movimientoReferencia.sum(
      "monto_comision",
      {
        where: {
          fecha_movimiento: {
            [db.Sequelize.Op.gte]: hace30Dias,
          },
        },
      }
    );

    const promedioComision = await db.movimientoReferencia.findOne({
      attributes: [
        [
          db.sequelize.fn("AVG", db.sequelize.col("monto_comision")),
          "promedio",
        ],
      ],
    });

    return res.status(200).json({
      por_estado: comisionesPorEstado,
      por_plan: comisionesPorPlan,
      ultimos_30_dias: parseFloat(comisionesUltimos30Dias || 0),
      promedio_comision: parseFloat(
        promedioComision?.dataValues?.promedio || 0
      ),
    });
  } catch (error) {
    logger.error("Error en obtenerKPIsComisiones:", error);
    return res.status(500).json({
      message: "Error al obtener KPIs de comisiones",
      error: error.message,
    });
  }
};

export const obtenerDashboardKPIs = async (req, res) => {
  try {
    const [generales, referentes, comisiones] = await Promise.all([
      obtenerKPIsGeneralesData(),
      obtenerKPIsReferentesData(),
      obtenerKPIsComisionesData(),
    ]);

    return res.status(200).json({
      generales,
      referentes,
      comisiones,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error en obtenerDashboardKPIs:", error);
    return res.status(500).json({
      message: "Error al obtener dashboard de KPIs",
      error: error.message,
    });
  }
};

const obtenerKPIsGeneralesData = async () => {
  const [
    totalUsuarios,
    totalReferentes,
    referentesActivos,
    totalReferidos,
    referidosActivos,
    totalComisiones,
  ] = await Promise.all([
    db.usuario.count(),
    db.referente.count(),
    db.referente.count({ where: { estado_referente: "activo" } }),
    db.referido.count(),
    db.referido.count({ where: { estado_referido: "activo" } }),
    db.movimientoReferencia.sum("monto_comision"),
  ]);

  return {
    usuarios: totalUsuarios,
    referentes: { total: totalReferentes, activos: referentesActivos },
    referidos: { total: totalReferidos, activos: referidosActivos },
    comisiones_total: parseFloat(totalComisiones || 0),
  };
};

const obtenerKPIsReferentesData = async () => {
  const topPorPuntos = await db.referente.findAll({
    attributes: ["codigo_referente", "puntos_actuales"],
    include: [
      {
        model: db.usuario,
        as: "usuario",
        attributes: ["nombre", "apellido"],
      },
    ],
    order: [["puntos_actuales", "DESC"]],
    limit: 5,
  });

  return { top_puntos: topPorPuntos };
};

const obtenerKPIsComisionesData = async () => {
  const comisionesPendientes = await db.movimientoReferencia.sum(
    "monto_comision",
    {
      where: { estado_comision: "pendiente" },
    }
  );

  return {
    pendientes: parseFloat(comisionesPendientes || 0),
  };
};

export default {
  obtenerKPIsGenerales,
  obtenerKPIsReferentes,
  obtenerKPIsComisiones,
  obtenerDashboardKPIs,
};
