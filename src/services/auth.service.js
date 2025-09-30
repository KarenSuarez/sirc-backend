import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const Usuario = db.usuario;
const Rol = db.rol;
const Referente = db.referente;

/**
 * Registra un nuevo usuario en el sistema.
 * Si el usuario tiene el rol 'referente', también crea un perfil de referente asociado.
 * @param {object} userData - Datos del usuario para el registro.
 * @param {string} userData.nombre - Nombre del usuario.
 * @param {string} userData.apellido - Apellido del usuario.
 * @param {string} userData.correo_electronico - Correo electrónico del usuario.
 * @param {string} userData.password - Contraseña del usuario (sin hashear).
 * @param {string} userData.numero_documento_identidad - Número de documento de identidad.
 * @param {number} userData.id_tipo_documento - ID del tipo de documento.
 * @param {string} [userData.telefono] - Teléfono del usuario (opcional).
 * @param {string[]} [userData.roles] - Array con los nombres de los roles a asignar. Si no se provee, se asigna 'referente' por defecto.
 * @returns {Promise<Usuario>} El objeto del usuario creado.
 * @throws {Error} Si el tipo de documento no existe.
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
 * Autentica a un usuario y devuelve sus datos junto con un token JWT.
 * @param {string} numero_documento_identidad - Número de documento de identidad del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} Un objeto con los datos del usuario y el token de acceso.
 * @property {number} id - ID del usuario.
 * @property {string} nombre - Nombre del usuario.
 * @property {string} apellido - Apellido del usuario.
 * @property {string} numero_documento_identidad - Número de documento del usuario.
 * @property {string[]} roles - Roles del usuario en formato 'ROLE_NOMBRE'.
 * @property {string} accessToken - Token JWT para la sesión.
 * @throws {Error} Si el usuario no se encuentra o la contraseña es incorrecta.
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
