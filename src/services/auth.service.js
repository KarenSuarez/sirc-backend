import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const Usuario = db.usuario;
const Rol = db.rol;
const Referente = db.referente;

/**
 * Lógica de negocio para registrar un nuevo usuario.
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

  // ✅ Crea el usuario
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
  let isReferente = false;
  if (roles && roles.length > 0) {
    const foundRoles = await Rol.findAll({
      where: { nombre_rol: { [Op.or]: roles } }
    });
    await usuario.setRoles(foundRoles);
    if (roles.includes('referente')) {
      isReferente = true;
    }
  } else {
    const defaultRol = await Rol.findOne({ where: { nombre_rol: "referente" } });
    if (defaultRol) {
      await usuario.setRoles([defaultRol]);
      isReferente = true;
    }
  }

  // ✅ Si el usuario es un referente, crea su perfil de referente
  if (isReferente) {
    await Referente.create({
      id_referente: usuario.id_usuario,
      codigo_referente: usuario.numero_documento_identidad,
      // Los demás campos usarán sus valores por defecto definidos en el modelo
    });
  }

  return usuario;
};

/**
 * Lógica de negocio para login de usuario.
 */
const loginUser = async (numero_documento_identidad, password) => {
  const usuario = await Usuario.findOne({
    where: { numero_documento_identidad },
    include: [{ model: Rol, as: "roles" }]
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  // ✅ Validar contraseña
  const passwordIsValid = bcrypt.compareSync(password, usuario.contrasena_hash);
  if (!passwordIsValid) {
    throw new Error("Contraseña incorrecta");
  }

  // ✅ Generar token JWT
  const token = jwt.sign(
    { id: usuario.id_usuario },
    config.secret,
    { expiresIn: 86400 } // 24h
  );

  // ✅ Mapear roles a formato legible
  const authorities = usuario.roles.map(
    rol => "ROLE_" + rol.nombre_rol.toUpperCase()
  );

  return {
    id: usuario.id_usuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    numero_documento_identidad: usuario.numero_documento_identidad,
    roles: authorities,
    accessToken: token
  };
};

export default {
  registerUser,
  loginUser
};
