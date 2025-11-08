import db from "../models/index.js";
import bcrypt from "bcryptjs";
import createLogger from "./logger.js";

const logger = createLogger("usuario.service.js");

class UsuarioService {
  /**
   * Buscar usuario por ID
   * @param {number} id_usuario - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  async buscarPorId(id_usuario) {
    try {
      const usuario = await db.usuario.findByPk(id_usuario, {
        attributes: { exclude: ["contrasena_hash"] },
        include: [
          {
            model: db.rol,
            as: "roles",
            attributes: ["id_rol", "nombre_rol", "codigo_rol"],
            through: { attributes: [] },
          },
          {
            model: db.tipoDocumento,
            as: "tipoDocumento",
            attributes: ["nombre_tipo", "codigo_tipo"],
          },
          {
            model: db.referente,
            as: "referente",
            required: false,
          },
        ],
      });

      return usuario;
    } catch (error) {
      logger.error("Error al buscar usuario por ID:", error);
      throw error;
    }
  }

  /**
   * Buscar usuario por número de documento
   * @param {string} numero_documento - Número de documento
   * @returns {Promise<Object>} Usuario encontrado
   */
  async buscarPorDocumento(numero_documento) {
    try {
      const usuario = await db.usuario.findOne({
        where: { numero_documento },
        attributes: { exclude: ["contrasena_hash"] },
      });
      return usuario;
    } catch (error) {
      logger.error("Error al buscar usuario por documento:", error);
      throw error;
    }
  }

  /**
   * Buscar usuario por correo electrónico
   * @param {string} correo_electronico - Correo
   * @returns {Promise<Object>} Usuario encontrado
   */
  async buscarPorCorreo(correo_electronico) {
    try {
      const usuario = await db.usuario.findOne({
        where: { correo_electronico },
        include: [
          {
            model: db.rol,
            as: "roles",
            attributes: ["codigo_rol"],
            through: { attributes: [] },
          },
        ],
      });
      return usuario;
    } catch (error) {
      logger.error("Error al buscar usuario por correo:", error);
      throw error;
    }
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} datos - Datos del usuario
   * @param {Array<string>} roles - Lista de códigos de rol (ej: ["REF", "ADMIN"])
   * @returns {Promise<Object>} Usuario creado
   */
  async crearUsuario(datos, roles = ["REF"]) {
    const transaction = await db.sequelize.transaction();

    try {
      const { contrasena, ...datosUsuario } = datos;

      const contrasena_hash = bcrypt.hashSync(contrasena, 10);

      const nuevoUsuario = await db.usuario.create(
        {
          ...datosUsuario,
          contrasena_hash,
          estado_usuario: "activo",
          fecha_registro: new Date(),
        },
        { transaction }
      );

      if (roles && roles.length > 0) {
        const rolesEncontrados = await db.rol.findAll({
          where: {
            codigo_rol: { [db.Sequelize.Op.in]: roles },
          },
          transaction,
        });

        if (rolesEncontrados.length > 0) {
          await nuevoUsuario.setRoles(rolesEncontrados, { transaction });
        }
      }

      await transaction.commit();

      logger.info(
        `Usuario creado exitosamente: ${nuevoUsuario.correo_electronico} (ID: ${nuevoUsuario.id_usuario})`
      );

      const { contrasena_hash: _, ...usuarioCreado } = nuevoUsuario.toJSON();
      return usuarioCreado;
    } catch (error) {
      await transaction.rollback();
      logger.error("Error al crear usuario:", error);
      throw error;
    }
  }

  /**
   * Actualizar un usuario
   * @param {number} id_usuario - ID del usuario
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async actualizarUsuario(id_usuario, datos) {
    try {
      const usuario = await db.usuario.findByPk(id_usuario);
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      const { contrasena, ...datosUsuario } = datos;

      if (contrasena) {
        logger.warn(`Actualizando contraseña para usuario ID: ${id_usuario}`);
        datosUsuario.contrasena_hash = bcrypt.hashSync(contrasena, 10);
      }

      await usuario.update(datosUsuario);

      logger.info(`Usuario actualizado: ID ${id_usuario}`);
      return usuario;
    } catch (error) {
      logger.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  /**
   * Desactivar un usuario (soft delete)
   * @param {number} id_usuario - ID del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  async desactivarUsuario(id_usuario) {
    try {
      const usuario = await db.usuario.findByPk(id_usuario);
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      await usuario.update({
        estado_usuario: "inactivo",
      });

      logger.info(`Usuario desactivado: ID ${id_usuario}`);
      return usuario;
    } catch (error) {
      logger.error("Error al desactivar usuario:", error);
      throw error;
    }
  }

  /**
   * Validar credenciales de un usuario
   * @param {string} correo - Correo
   * @param {string} contrasena - Contraseña
   * @returns {Promise<Object>} Usuario validado
   */
  async validarCredenciales(correo, contrasena) {
    try {
      const usuario = await db.usuario.findOne({
        where: { correo_electronico: correo },
        include: [
          {
            model: db.rol,
            as: "roles",
            attributes: ["codigo_rol"],
            through: { attributes: [] },
          },
        ],
      });

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      if (usuario.estado_usuario !== "activo") {
        throw new Error("Usuario inactivo o bloqueado");
      }

      const esValida = bcrypt.compareSync(contrasena, usuario.contrasena_hash);

      if (!esValida) {
        throw new Error("Contraseña incorrecta");
      }

      return usuario;
    } catch (error) {
      logger.error("Error al validar credenciales:", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas
   */
  async obtenerEstadisticas() {
    try {
      const [totalUsuarios, usuariosPorRol, registrosRecientes] =
        await Promise.all([
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

      return {
        total_usuarios: totalUsuarios,
        usuarios_por_rol: usuariosPorRol,
        nuevos_ultimos_30_dias: registrosRecientes,
      };
    } catch (error) {
      logger.error("Error al obtener estadísticas de usuarios:", error);
      throw error;
    }
  }
}

export default new UsuarioService();
