import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createLogger from "../../utils/logger.js";

const logger = createLogger("auth.controller");

export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      correo_electronico,
      password,
      numero_documento,
      id_tipo_documento,
      telefono,
      roles,
      tipo_referente,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !correo_electronico ||
      !password ||
      !numero_documento ||
      !id_tipo_documento
    ) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
      });
    }

    const usuarioExistente = await db.usuario.findOne({
      where: { numero_documento },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese número de documento",
      });
    }

    const correoExistente = await db.usuario.findOne({
      where: { correo_electronico },
    });

    if (correoExistente) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese correo electrónico",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await db.usuario.create({
      nombre,
      apellido,
      correo_electronico,
      contrasena_hash,
      numero_documento,
      id_tipo_documento,
      telefono: telefono || null,
      fecha_registro: new Date(),
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    logger.info(`Usuario creado: ID ${nuevoUsuario.id_usuario}`);

    let esReferente = false;

    if (roles && roles.length > 0) {
      const rolesEncontrados = await db.rol.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { nombre_rol: { [db.Sequelize.Op.in]: roles } },
            {
              codigo_rol: {
                [db.Sequelize.Op.in]: roles.map((r) => r.toUpperCase()),
              },
            },
          ],
        },
      });

      if (rolesEncontrados.length > 0) {
        for (const rol of rolesEncontrados) {
          await db.rolUsuario.create({
            id_usuario: nuevoUsuario.id_usuario,
            id_rol: rol.id_rol,
          });

          if (rol.codigo_rol === "REF" || rol.nombre_rol === "referente") {
            esReferente = true;
          }
        }
        logger.info(
          `Roles asignados: ${rolesEncontrados.map((r) => r.nombre_rol).join(", ")}`
        );
      }
    } else {
      const rolReferente = await db.rol.findOne({
        where: { codigo_rol: "REF" },
      });

      if (rolReferente) {
        await db.rolUsuario.create({
          id_usuario: nuevoUsuario.id_usuario,
          id_rol: rolReferente.id_rol,
        });
        esReferente = true;
        logger.info("Rol 'referente' asignado por defecto");
      }
    }

    if (esReferente) {
      const codigo_referente = `REF-${String(nuevoUsuario.id_usuario).padStart(6, "0")}`;

      await db.referente.create({
        id_usuario: nuevoUsuario.id_usuario,
        codigo_referente,
        tipo_referente: tipo_referente || "cliente_externo",
        puntos_actuales: 0,
        puntos_totales_historico: 0,
        saldo_disponible: 0.0,
        total_comisiones_historico: 0.0,
        total_retirado: 0.0,
        estado_referente: "activo",
        fecha_ultima_actividad: new Date(),
      });

      logger.info(`Perfil de referente creado: ${codigo_referente} (${tipo_referente || 'cliente_externo'})`);

      const NivelService = (await import("../../services/nivel.service.js"))
        .default;
      await NivelService.verificarYActualizarNivel(nuevoUsuario.id_usuario, 0);
    }

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo_electronico: nuevoUsuario.correo_electronico,
        numero_documento: nuevoUsuario.numero_documento,
      },
    });
  } catch (error) {
    logger.error("Error en register:", error);
    return res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { numero_documento, password } = req.body;

    if (!numero_documento || !password) {
      return res.status(400).json({
        message: "Número de documento y contraseña son requeridos",
      });
    }

    const usuario = await db.usuario.findOne({
      where: { numero_documento },
      include: [
        {
          model: db.rol,
          as: "roles",
          attributes: ["id_rol", "nombre_rol", "codigo_rol"],
          through: { attributes: [] },
        },
      ],
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.contrasena_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const roles_ids = usuario.roles.map((rol) => rol.id_rol);
    const roles_nombres = usuario.roles.map((rol) => rol.nombre_rol);

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        numero_documento: usuario.numero_documento,
        rls_id: roles_ids,
        roles: roles_nombres,
      },
      process.env.SECRET || "secret-key-default",
      {
        expiresIn: "24h",
      }
    );

    await db.historialSesion.create({
      id_usuario: usuario.id_usuario,
      login_time: new Date(),
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers["user-agent"] || "Unknown",
    });

    logger.info(`Login exitoso: Usuario ${usuario.id_usuario}`);

    return res.status(200).json({
      message: "Login exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo_electronico: usuario.correo_electronico,
        numero_documento: usuario.numero_documento,
        telefono: usuario.telefono,
        roles: roles_nombres,
      },
    });
  } catch (error) {
    logger.error("Error en login:", error);
    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const ultimaSesion = await db.historialSesion.findOne({
      where: {
        id_usuario,
        logout_time: null,
      },
      order: [["login_time", "DESC"]],
    });

    if (ultimaSesion) {
      await ultimaSesion.update({
        logout_time: new Date(),
      });
    }

    logger.info(`Logout exitoso: Usuario ${id_usuario}`);

    return res.status(200).json({
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    logger.error("Error en logout:", error);
    return res.status(500).json({
      message: "Error al cerrar sesión",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const usuario = await db.usuario.findByPk(id_usuario, {
      attributes: [
        "id_usuario",
        "numero_documento",
        "id_tipo_documento",
        "nombre",
        "apellido",
        "correo_electronico",
        "telefono",
        "fecha_registro",
      ],
      include: [
        {
          model: db.rol,
          as: "roles",
          attributes: ["id_rol", "nombre_rol", "codigo_rol"],
          through: { attributes: [] },
        },
        {
          model: db.referente,
          as: "referente",
          attributes: [
            "codigo_referente",
            "tipo_referente",
            "puntos_actuales",
            "puntos_totales_historico",
            "saldo_disponible",
            "total_comisiones_historico",
            "total_retirado",
            "estado_referente",
          ],
        },
        {
          model: db.tipoDocumento, // ⭐ AGREGADO
          as: "tipoDocumento",
          attributes: ["id_tipo_documento", "codigo_tipo", "nombre_tipo"],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    logger.error("Error en getMe:", error);
    return res.status(500).json({
      message: "Error al obtener información del usuario",
      error: error.message,
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { nombre, apellido, correo_electronico, telefono } = req.body;

    const usuario = await db.usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (correo_electronico && correo_electronico !== usuario.correo_electronico) {
      const correoExistente = await db.usuario.findOne({
        where: {
          correo_electronico,
          id_usuario: { [db.Sequelize.Op.ne]: id_usuario },
        },
      });

      if (correoExistente) {
        return res.status(400).json({
          message: "El correo electrónico ya está en uso",
        });
      }
    }

    const camposActualizables = {};
    if (nombre !== undefined) camposActualizables.nombre = nombre;
    if (apellido !== undefined) camposActualizables.apellido = apellido;
    if (correo_electronico !== undefined) camposActualizables.correo_electronico = correo_electronico;
    if (telefono !== undefined) camposActualizables.telefono = telefono;
    camposActualizables.actualizado_en = new Date();

    await usuario.update(camposActualizables);

    logger.info(`Perfil actualizado: Usuario ${id_usuario}`);

    const usuarioActualizado = await db.usuario.findByPk(id_usuario, {
      attributes: [
        "id_usuario",
        "numero_documento",
        "id_tipo_documento",
        "nombre",
        "apellido",
        "correo_electronico",
        "telefono",
        "fecha_registro",
      ],
      include: [
        {
          model: db.rol,
          as: "roles",
          attributes: ["id_rol", "nombre_rol", "codigo_rol"],
          through: { attributes: [] },
        },
        {
          model: db.referente,
          as: "referente",
          attributes: [
            "codigo_referente",
            "tipo_referente",
            "puntos_actuales",
            "puntos_totales_historico",
            "saldo_disponible",
            "total_comisiones_historico",
            "total_retirado",
            "estado_referente",
          ],
        },
        {
          model: db.tipoDocumento,
          as: "tipoDocumento",
          attributes: ["id_tipo_documento", "codigo_tipo", "nombre_tipo"],
        },
      ],
    });

    return res.status(200).json({
      message: "Perfil actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    logger.error("Error en updateMe:", error);
    return res.status(500).json({
      message: "Error al actualizar perfil",
      error: error.message,
    });
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  updateMe,
};