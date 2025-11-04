import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import { Op, Sequelize } from "sequelize";

const Usuario = db.usuario;
const Rol = db.rol;
const Referente = db.referente;
const HistorialSesion = db.historialSesion;
const historialNivel = db.historialNivel;
const nivel = db.nivel;

/**
 * Registra un nuevo usuario en el sistema. Si el usuario tiene el rol
 * 'referente', también crea un perfil de referente asociado.
 *
 * @param {object} userData - Datos del usuario para el registro.
 * @param {string} userData.nombre - Nombre del usuario.
 * @param {string} userData.apellido - Apellido del usuario.
 * @param {string} userData.correo_electronico - Correo electrónico del usuario.
 * @param {string} userData.password - Contraseña del usuario (sin hashear).
 * @param {string} userData.numero_documento_identidad - Número de documento de
 *   identidad.
 * @param {number} userData.id_tipo_documento - ID del tipo de documento.
 * @param {string} [userData.telefono] - Teléfono del usuario (opcional).
 * @param {string[]} [userData.roles] - Array con los nombres de los roles a
 *   asignar. Si no se provee, se asigna 'referente' por defecto.
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
    roles,
  } = userData;

  // Verifica si el tipo de documento existe
  const tipoDocumento = await db.tipoDocumento.findByPk(id_tipo_documento);
  if (!tipoDocumento) {
    throw new Error("El tipo de documento especificado no existe.");
  }

  // Crea el usuario
  const usuario = await Usuario.create({
    nombre,
    apellido,
    correo_electronico,
    contrasena_hash: bcrypt.hashSync(password, 8), //
    numero_documento_identidad,
    id_tipo_documento,
    telefono,
  });

  // Asignación de roles
  let isReferente = false;
  
  if (roles && roles.length > 0) {
    const foundRoles = await Rol.findAll({
      where: { nombre_rol: { [Op.or]: roles } },
    });
    await usuario.setRoles(foundRoles);
    if (roles.includes("referente")) {
      isReferente = true;
    }
  } else {
    const defaultRol = await Rol.findOne({
      where: { nombre_rol: "referente" },
    });
    if (defaultRol) {
      await usuario.setRoles([defaultRol]);
      isReferente = true;
    }
  }

  // Si el usuario es un referente, crea su perfil de referente
  if (isReferente) {
    await crearReferente(usuario.numero_documento_identidad)
  }

  return usuario;
};

async function crearReferente(numero_documento_identidad) {
    await Referente.create({
      numero_documento_identidad: numero_documento_identidad,
    });
    const nivelInicial = await nivel.findOne({
      where: { orden: 1 },
    });
    await historialNivel.create({
      id_referente: numero_documento_identidad,
      nivel_anterior: null,
      nivel_nuevo: nivelInicial.id_nivel,
      puntos_al_momento: 0,
      actualizado_en: new Date()
    });
}
/**
 * Autentica a un usuario y devuelve sus datos junto con un token JWT.
 *
 * @property {string} numero_documento_identidad - Número de documento del
 *   usuario.
 * @property {string} nombre - Nombre del usuario.
 * @property {string} apellido - Apellido del usuario.
 * @property {string[]} roles - Roles del usuario en formato 'ROLE_NOMBRE'.
 * @property {string} accessToken - Token JWT para la sesión.
 * @param {string} numero_documento_identidad - Número de documento de identidad
 *   del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} Un objeto con los datos del usuario y el token de
 *   acceso.
 * @returns {string} El token tiene una estructura {documento_id:
 *   numero_documento_identidad, rls_id: [1,2,...]}
 * @throws {Error} Si el usuario no se encuentra o la contraseña es incorrecta.
 */
const loginUser = async (numero_documento_identidad, password, datosLogin) => {
  const attemptKey = `${numero_documento_identidad}_${datosLogin.ipAddress}`;
  
  // Verificar si la cuenta está bloqueada
  const attempts = loginAttempts.get(attemptKey);
  if (attempts && attempts.locked && Date.now() < attempts.lockUntil) {
    const remainingTime = Math.ceil((attempts.lockUntil - Date.now()) / 60000);
    throw new Error(`Cuenta temporalmente bloqueada. Intente nuevamente en ${remainingTime} minutos.`);
  }

  const usuario = await Usuario.findOne({
    where: { numero_documento_identidad },
    include: [{ model: Rol, as: "roles" }],
  });

  if (!usuario) {
    // Registrar intento fallido
    recordFailedAttempt(attemptKey);
    throw new Error("Usuario no encontrado");
  }

  // Validar contraseña
  const passwordIsValid = bcrypt.compareSync(password, usuario.contrasena_hash);
  if (!passwordIsValid) {
    // Registrar intento fallido
    recordFailedAttempt(attemptKey);
    throw new Error("Contraseña incorrecta");
  }

  // Limpiar intentos fallidos en login exitoso
  loginAttempts.delete(attemptKey);

  // Generar token JWT
  const token = jwt.sign(
    {
      documento_id: usuario.numero_documento_identidad,
      rls_id: usuario.roles.map((r) => r.id_rol),
    },
    config.secret,
    {
      expiresIn: 86400, // 24 horas
    },
  );

  // Mapear roles a formato legible
  const authorities = usuario.roles.map(
    (rol) => "ROLE_" + rol.nombre_rol.toUpperCase(),
  );

  // Cerrar sesiones previas haciendo una petición interna
  await requestForLogout(usuario.numero_documento_identidad);
  // Registrar historial de sesión
  await HistorialSesion.create({
    usuario_id: usuario.numero_documento_identidad,
    ip_address: datosLogin.ipAddress,
    dispositivo: datosLogin.deviceInfo,
    token: lastValueToken(token),
  });

  return {
    numero_documento_identidad: usuario.numero_documento_identidad,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    roles: authorities,
    accessToken: token,
  };
};

async function requestForLogout(numero_documento_identidad) {
  try {
    await axios.post(
      "http:localhost:5000/api/auth/logoutbyid",
      {
        numero_documento_identidad: numero_documento_identidad,
      }
    );
  } catch (error) {
    console.error("Error making logout request:", error);
  }
}
/**
 * Dado un id de usuario, cierra la sesión activa correspondiente
 *
 * @param {int} numero_documento_identidad Id del usuario
 * @param {string} tokenIn Token JWT completo
 */
const logoutAllSessionForId = async (numero_documento_identidad) => {
  let itWorks = true;
  try {
    await HistorialSesion.update(
      { fecha_fin: Sequelize.literal("CURRENT_TIMESTAMP") }, // Usar CURRENT_TIMESTAMP para la fecha actual
      {
        where: {
          usuario_id: numero_documento_identidad,
        },
      }
    );
  } catch (error) {
    itWorks = false;
    throw new Error(error);
  }
  return itWorks;
}
/**
 * 
 * @param {*} numero_documento_identidad 
 * @param {*} tokenIn 
 */
const logoutSession = async (numero_documento_identidad, tokenIn) => {
  const sessionUnqInformation = lastValueToken(tokenIn);
  const ultimaSesion = await HistorialSesion.findOne({
    where: {
      usuario_id: numero_documento_identidad,
      token: {
        [Op.like]: sessionUnqInformation,
      },
    },
    order: [["fecha_inicio", "DESC"]],
  });

  if (ultimaSesion && !ultimaSesion.fecha_fin) {
    ultimaSesion.fecha_fin = new Date();
    await ultimaSesion.save();
  }
};
/**
 * Busca en la tabla Usuario segun el correo
 *
 * @param {string} correoElectronico
 * @returns
 */
const findByCorreo = (correoElectronico) => {
  return Usuario.findOne({
    where: {
      correo_electronico: correoElectronico,
    },
  });
};

/**
 * Busca en la tabla Usuario segun el correo
 *
 * @param {string} numeroDocumentoIdentidad
 * @returns
 */
const findByDocumento = (numeroDocumentoIdentidad) => {
  return Usuario.findOne({
    where: {
      numero_documento_identidad: numeroDocumentoIdentidad,
    },
  });
};

/**
 * @param {String} token
 * @returns {String} Sub string del token, especificamente la última parte con
 *   la que se identifica la sesión
 */
function lastValueToken(token) {
  let tempSplitedToken = token.split(".");
  return tempSplitedToken[tempSplitedToken.length - 1];
}

// Almacenamiento en memoria para intentos fallidos (mejor usar Redis en producción)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos

// Función auxiliar para registrar intentos fallidos
const recordFailedAttempt = (attemptKey) => {
  const attempts = loginAttempts.get(attemptKey) || { count: 0, locked: false };
  attempts.count += 1;

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.locked = true;
    attempts.lockUntil = Date.now() + LOCK_TIME;
    console.warn(`[SECURITY] Cuenta bloqueada temporalmente: ${attemptKey}`);
  }

  loginAttempts.set(attemptKey, attempts);

  // Limpiar intentos antiguos cada hora
  setTimeout(() => {
    if (loginAttempts.has(attemptKey)) {
      const current = loginAttempts.get(attemptKey);
      if (!current.locked || Date.now() >= current.lockUntil) {
        loginAttempts.delete(attemptKey);
      }
    }
  }, 60 * 60 * 1000);
};

export default {
  registerUser,
  loginUser,
  logoutSession,
  lastValueToken,
  findByCorreo,
  findByDocumento,
  logoutAllSessionForId
};