import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import createLogger from "../../utils/logger.js";

const logger = createLogger("usuario.controller");

export const listarUsuarios = async (req, res) => {
  try {
    const { rol, estado, limite = 50, pagina = 1 } = req.query;

    const where = {};
    const include = [
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
          "estado_referente",
          "puntos_actuales",
          "saldo_disponible",
        ],
        required: false,
      },
    ];

    if (rol) {
      include[0].where = {
        [db.Sequelize.Op.or]: [
          { nombre_rol: rol },
          { codigo_rol: rol.toUpperCase() },
        ],
      };
    }

    if (estado && estado === "activo") {
      include[1].where = { estado_referente: "activo" };
      include[1].required = true;
    }

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows } = await db.usuario.findAndCountAll({
      where,
      include,
      limit: parseInt(limite),
      offset,
      order: [["creado_en", "DESC"]],
      distinct: true,
    });

    return res.status(200).json({
      total: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas: Math.ceil(count / parseInt(limite)),
      usuarios: rows,
    });
  } catch (error) {
    logger.error("Error en listarUsuarios:", error);
    return res.status(500).json({
      message: "Error al listar usuarios",
      error: error.message,
    });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await db.usuario.findByPk(id, {
      attributes: { exclude: ["contrasena_hash"] },
      include: [
        {
          model: db.rol,
          as: "roles",
          attributes: ["id_rol", "nombre_rol", "codigo_rol", "descripcion"],
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

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    logger.error("Error en obtenerUsuario:", error);
    return res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo_electronico, telefono, password } =
      req.body;

    const usuario = await db.usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const datosActualizar = {
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      correo_electronico: correo_electronico || usuario.correo_electronico,
      telefono: telefono || usuario.telefono,
      actualizado_en: new Date(),
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizar.contrasena_hash = await bcrypt.hash(password, salt);
    }

    await usuario.update(datosActualizar);

    logger.info(`Usuario actualizado: ID ${id}`);

    const usuarioActualizado = await db.usuario.findByPk(id, {
      attributes: { exclude: ["contrasena_hash"] },
    });

    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    logger.error("Error en actualizarUsuario:", error);
    return res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await db.usuario.findByPk(id, {
      include: [
        {
          model: db.referente,
          as: "referente",
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (usuario.referente) {
      await usuario.referente.update({
        estado_referente: "inactivo",
      });
      logger.info(
        `Perfil de referente desactivado: ${usuario.referente.codigo_referente}`
      );
    }

    logger.info(`Usuario desactivado: ID ${id}`);

    return res.status(200).json({
      message: "Usuario desactivado exitosamente",
    });
  } catch (error) {
    logger.error("Error en desactivarUsuario:", error);
    return res.status(500).json({
      message: "Error al desactivar usuario",
      error: error.message,
    });
  }
};

export default {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  desactivarUsuario,
};
