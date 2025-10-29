/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       description: Representa un rol de usuario en el sistema.
 *       properties:
 *         id_rol:
 *           type: integer
 *           description: ID único del rol.
 *           example: 1
 *         nombre_rol:
 *           type: string
 *           description: Nombre del rol.
 *           example: "administrador"
 *         descripcion:
 *           type: string
 *           description: Descripción opcional del rol.
 *           example: "Rol con permisos de administración total"
 *         creado_en:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del rol.
 *           example: "2025-09-29T20:00:00Z"
 *       required:
 *         - nombre_rol
 */

export default (sequelize, Sequelize) => {
  const Rol = sequelize.define(
    "rol",
    {
      id_rol: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_rol: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
      },
    },
    {
      tableName: "rol",
      timestamps: true,
      createdAt: "creado_en",
      updatedAt: false,
    },
  );

  return Rol;
};
