import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

    console.log(id_tipo_documento); // Verifica el valor aquí

    // Verifica si el tipo de documento existe
    const tipoDocumento = await db.tipoDocumento.findByPk(id_tipo_documento);
    if (!tipoDocumento) {
        throw new Error("El tipo de documento especificado no existe.");
    }

    // Crea el usuario en la base de datos
    const usuario = await Usuario.create({
        nombre: nombre,
        apellido: apellido,
        correo_electronico: correo_electronico,
        contrasena_hash: bcrypt.hashSync(password, 8),
        numero_documento_identidad: numero_documento_identidad,
        id_tipo_documento: id_tipo_documento,
        telefono: telefono
    });

    // Asigna roles
    if (roles && roles.length > 0) {
        const foundRoles = await Rol.findAll({
            where: { nombre_rol: { [Op.or]: roles } }
        });
        await usuario.setRoles(foundRoles);
    } else {
        const defaultRol = await Rol.findOne({ where: { nombre_rol: 'referente' } });
        if (defaultRol) {
            await usuario.setRoles([defaultRol]);
        }
    }

    return usuario;
};

// ... Aquí iría la lógica para el login también

export default {
    registerUser
};

