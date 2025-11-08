import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("usuarioGerente.controller");

export const obtenerEquipo = async (req, res) => {
  try {
    const id_gerente = req.userId;

    const asesores = await db.usuario.findAll({
      include: [
        {
          model: db.rol,
          as: "roles",
          where: {
            codigo_rol: "ASESOR",
          },
          attributes: ["nombre_rol", "codigo_rol"],
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id_usuario",
        "numero_documento",
        "nombre",
        "apellido",
        "correo_electronico",
        "telefono",
        "fecha_registro",
      ],
      order: [["creado_en", "DESC"]],
    });

    const asesoresConMetricas = await Promise.all(
      asesores.map(async (asesor) => {
        const referidosConvertidos = await db.referido.count({
          where: {
            id_asesor_vendedor: asesor.id_usuario,
            estado_referido: "activo",
          },
        });

        const comisionesGeneradas = await db.sequelize.query(
          `
          SELECT SUM(mr.monto_comision) as total
          FROM MovimientoReferencia mr
          INNER JOIN Referido ref ON mr.id_referido = ref.id_referido
          WHERE ref.id_asesor_vendedor = :id_asesor
          `,
          {
            replacements: { id_asesor: asesor.id_usuario },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );

        return {
          ...asesor.toJSON(),
          metricas: {
            referidos_convertidos: referidosConvertidos,
            comisiones_generadas: parseFloat(
              comisionesGeneradas[0]?.total || 0
            ),
          },
        };
      })
    );

    return res.status(200).json({
      total_asesores: asesoresConMetricas.length,
      equipo: asesoresConMetricas,
    });
  } catch (error) {
    logger.error("Error en obtenerEquipo:", error);
    return res.status(500).json({
      message: "Error al obtener equipo",
      error: error.message,
    });
  }
};

export const obtenerRendimiento = async (req, res) => {
  try {
    const id_gerente = req.userId;
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

    const asesores = await db.usuario.findAll({
      include: [
        {
          model: db.rol,
          as: "roles",
          where: { codigo_rol: "ASESOR" },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ["id_usuario"],
    });

    const idsAsesores = asesores.map((a) => a.id_usuario);

    if (idsAsesores.length === 0) {
      return res.status(200).json({
        periodo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        metricas: {
          referidos_convertidos: 0,
          comisiones_generadas: 0,
        },
        top_asesores: [],
      });
    }

    const referidosConvertidos = await db.referido.count({
      where: {
        id_asesor_vendedor: {
          [db.Sequelize.Op.in]: idsAsesores,
        },
        estado_referido: "activo",
        fecha_conversion: {
          [db.Sequelize.Op.between]: [fechaInicio, fechaFin],
        },
      },
    });

    const comisionesGeneradas = await db.sequelize.query(
      `
      SELECT SUM(mr.monto_comision) as total
      FROM MovimientoReferencia mr
      INNER JOIN Referido ref ON mr.id_referido = ref.id_referido
      WHERE ref.id_asesor_vendedor IN (:idsAsesores)
        AND mr.fecha_movimiento BETWEEN :fechaInicio AND :fechaFin
      `,
      {
        replacements: {
          idsAsesores,
          fechaInicio,
          fechaFin,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const topAsesores = await db.sequelize.query(
      `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        COUNT(ref.id_referido) as referidos_convertidos,
        SUM(mr.monto_comision) as comisiones_generadas
      FROM Usuario u
      INNER JOIN RolUsuario ru ON u.id_usuario = ru.id_usuario
      INNER JOIN Rol r ON ru.id_rol = r.id_rol
      LEFT JOIN Referido ref ON u.id_usuario = ref.id_asesor_vendedor
        AND ref.estado_referido = :estadoActivo
        AND ref.fecha_conversion BETWEEN :fechaInicio AND :fechaFin
      LEFT JOIN MovimientoReferencia mr ON ref.id_referido = mr.id_referido
      WHERE r.codigo_rol = :codigoRol
      GROUP BY u.id_usuario, u.nombre, u.apellido
      ORDER BY comisiones_generadas DESC
      LIMIT 5
      `,
      {
        replacements: {
          estadoActivo: "activo",
          fechaInicio,
          fechaFin,
          codigoRol: "ASESOR",
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      periodo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      metricas: {
        referidos_convertidos: referidosConvertidos,
        comisiones_generadas: parseFloat(comisionesGeneradas[0]?.total || 0),
      },
      top_asesores: topAsesores.map((a) => ({
        ...a,
        comisiones_generadas: parseFloat(a.comisiones_generadas || 0),
      })),
    });
  } catch (error) {
    logger.error("Error en obtenerRendimiento:", error);
    return res.status(500).json({
      message: "Error al obtener rendimiento",
      error: error.message,
    });
  }
};

export const obtenerEstadisticasDetalladas = async (req, res) => {
  try {
    const id_gerente = req.userId;

    const referentesPorNivel = await db.sequelize.query(
      `
      SELECT 
        n.nombre_nivel,
        n.color_nivel,
        COUNT(DISTINCT hn.id_referente) as cantidad
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

    const referidosPorEstado = await db.referido.findAll({
      attributes: [
        "estado_referido",
        [db.sequelize.fn("COUNT", db.sequelize.col("id_referido")), "cantidad"],
      ],
      group: ["estado_referido"],
    });

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

    return res.status(200).json({
      referentes_por_nivel: referentesPorNivel,
      referidos_por_estado: referidosPorEstado,
      comisiones_por_estado: comisionesPorEstado,
    });
  } catch (error) {
    logger.error("Error en obtenerEstadisticasDetalladas:", error);
    return res.status(500).json({
      message: "Error al obtener estadísticas detalladas",
      error: error.message,
    });
  }
};

export default {
  obtenerEquipo,
  obtenerRendimiento,
  obtenerEstadisticasDetalladas,
};
