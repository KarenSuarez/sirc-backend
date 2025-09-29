import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Op } from "sequelize"; // ✅ Importar Op correctamente

const Usuario = db.usuario;
const Rol = db.rol;

/**
 * Lógica de negocio para registrar un nuevo usuario.
 * @param {object} userData - Datos del usuario.
 * @returns {Promise<object>} - El usuario creado.
 */
const registerUser = async (userData) => {
  const {
    nombre,
    apellido,
    correo_electronico,
    password,
    numero_documento_identidad,
    id_tipo_documento,
    telefono,
    roles
  } = userData;

  // ✅ Verifica si el tipo de documento existe
  const tipoDocumento = await db.tipoDocumento.findByPk(id_tipo_documento);
  if (!tipoDocumento) {
    throw new Error("El tipo de documento especificado no existe.");
  }

  // ✅ Crea el usuario en la base de datos
  const usuario = await Usuario.create({
    nombre,
    apellido,
    correo_electronico,
    contrasena_hash: bcrypt.hashSync(password, 8),
    numero_documento_identidad,
    id_tipo_documento,
    telefono
  });

  // ✅ Asignación de roles
  if (roles && roles.length > 0) {
    // Busca roles en la BD que coincidan con la lista enviada
    const foundRoles = await Rol.findAll({
      where: { nombre_rol: { [Op.or]: roles } }
    });

    // Usa setRols porque tu modelo se llama "Rol" en singular
    await usuario.setRols(foundRoles);
  } else {
    // Rol por defecto: referente
    const defaultRol = await Rol.findOne({ where: { nombre_rol: "referente" } });
    if (defaultRol) {
      await usuario.setRols([defaultRol]);
    }
  }

  return usuario;
};

export default {
  registerUser
};
