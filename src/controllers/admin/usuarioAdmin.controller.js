import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("usuarioAdmin.controller");

export const obtenerEstadisticas = async (req, res) => {
  try {
    const [
      totalUsuarios,
      usuariosPorRol,
      referentesActivos,
      usuariosRecientes,
    ] = await Promise.all([
      db.usuario.count(),

      db.sequelize.query(
        `
        SELECT 
          r.nombre_rol,
          r.codigo_rol,
          COUNT(ru.id_usuario) as cantidad
        FROM Rol r
        LEFT JOIN RolUsuario ru ON r.id_rol = ru.id_rol
        GROUP BY r.id_rol, r.nombre_rol, r.codigo_rol
        ORDER BY cantidad DESC
        `,
        { type: db.Sequelize.QueryTypes.SELECT }
      ),

      db.referente.count({ where: { estado_referente: "activo" } }),

      db.usuario.count({
        where: {
          fecha_registro: {
            [db.Sequelize.Op.gte]: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ),
          },
        },
      }),
    ]);

    return res.status(200).json({
      total_usuarios: totalUsuarios,
      por_rol: usuariosPorRol,
      referentes_activos: referentesActivos,
      registros_ultimos_30_dias: usuariosRecientes,
    });
  } catch (error) {
    logger.error("Error en obtenerEstadisticas:", error);
    return res.status(500).json({
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

export const asignarRol = async (req, res) => {
  try {
    const { id_usuario, id_rol } = req.body;

    if (!id_usuario || !id_rol) {
      return res.status(400).json({
        message: "id_usuario e id_rol son requeridos",
      });
    }

    const usuario = await db.usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const rol = await db.rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({
        message: "Rol no encontrado",
      });
    }

    const yaAsignado = await db.rolUsuario.findOne({
      where: { id_usuario, id_rol },
    });

    if (yaAsignado) {
      return res.status(400).json({
        message: "El usuario ya tiene este rol asignado",
      });
    }

    await db.rolUsuario.create({
      id_usuario,
      id_rol,
    });

    if (rol.codigo_rol === "REF") {
      const referenteExistente = await db.referente.findByPk(id_usuario);

      if (!referenteExistente) {
        const codigo_referente = `REF-${String(id_usuario).padStart(6, "0")}`;

        await db.referente.create({
          id_usuario,
          codigo_referente,
          tipo_referente: "cliente_externo",
          puntos_actuales: 0,
          puntos_totales_historico: 0,
          saldo_disponible: 0.0,
          total_comisiones_historico: 0.0,
          total_retirado: 0.0,
          estado_referente: "activo",
          fecha_ultima_actividad: new Date(),
        });

        const NivelService = (await import("../../services/nivel.service.js"))
          .default;
        await NivelService.verificarYActualizarNivel(id_usuario, 0);

        logger.info(`Perfil de referente creado para usuario ${id_usuario}`);
      }
    }

    logger.info(`Rol ${rol.nombre_rol} asignado a usuario ${id_usuario}`);

    return res.status(200).json({
      message: `Rol ${rol.nombre_rol} asignado exitosamente`,
    });
  } catch (error) {
    logger.error("Error en asignarRol:", error);
    return res.status(500).json({
      message: "Error al asignar rol",
      error: error.message,
    });
  }
};

export const removerRol = async (req, res) => {
  try {
    const { id_usuario, id_rol } = req.body;

    if (!id_usuario || !id_rol) {
      return res.status(400).json({
        message: "id_usuario e id_rol son requeridos",
      });
    }

    const rolUsuario = await db.rolUsuario.findOne({
      where: { id_usuario, id_rol },
    });

    if (!rolUsuario) {
      return res.status(404).json({
        message: "El usuario no tiene este rol asignado",
      });
    }

    await rolUsuario.destroy();

    logger.info(`Rol removido de usuario ${id_usuario}`);

    return res.status(200).json({
      message: "Rol removido exitosamente",
    });
  } catch (error) {
    logger.error("Error en removerRol:", error);
    return res.status(500).json({
      message: "Error al remover rol",
      error: error.message,
    });
  }
};

export default {
  obtenerEstadisticas,
  asignarRol,
  removerRol,
};
