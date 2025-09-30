/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       description: Representa un usuario del sistema.
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID único del usuario.
 *           example: 1
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del usuario.
 *           example: "john.doe@example.com"
 *         contrasena_hash:
 *           type: string
 *           description: Hash de la contraseña del usuario.
 *           example: "$2a$08$N9qo8uLOickgx2ZMRZo5i.U..."
 *         nombre:
 *           type: string
 *           description: Nombre del usuario.
 *           example: "John"
 *         apellido:
 *           type: string
 *           description: Apellido del usuario.
 *           example: "Doe"
 *         numero_documento_identidad:
 *           type: string
 *           description: Número de documento de identidad del usuario.
 *           example: "123456789"
 *         telefono:
 *           type: string
 *           description: Teléfono del usuario (opcional).
 *           example: "1234567890"
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del usuario.
 *           example: "2025-09-29T20:00:00Z"
 *         id_tipo_documento:
 *           type: integer
 *           description: ID del tipo de documento asociado al usuario.
 *           example: 1
 *       required:
 *         - correo_electronico
 *         - contrasena_hash
 *         - nombre
 *         - apellido
 *         - numero_documento_identidad
 */


// Modelo Sequelize para la tabla Usuario
export default (sequelize, Sequelize) => {
    const Usuario = sequelize.define("Usuario", {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      correo_electronico: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      contrasena_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      numero_documento_identidad: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      // id_tipo_documento es generado por la asociación
    }, {
      tableName: 'Usuario',
      timestamps: true,
      createdAt: 'fecha_registro',
      updatedAt: false // Si no tienes una columna para updatedAt
    });

    return Usuario;
};

