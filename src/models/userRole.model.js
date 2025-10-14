/**
 * @swagger
 * components:
 *   schemas:
 *     RolUsuario:
 *       type: object
 *       description: Relación muchos a muchos entre Usuario y Rol.
 *       properties:
 *         numero_documento_identidad:
 *           type: string
 *           description: Número de documento de identidad del usuario (clave primaria y foránea).
 *           example: "123456789"
 *         id_rol:
 *           type: integer
 *           description: ID del rol asignado al usuario.
 *           example: 2
 *       required:
 *         - numero_documento_identidad
 *         - id_rol
 */


export default (sequelize, DataTypes) => {
  const RolUsuario = sequelize.define("RolUsuario", {
    numero_documento_identidad: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "Usuario",
        key: "numero_documento_identidad"
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Rol",
        key: "id_rol"
      }
    }
  }, {
    tableName: "RolUsuario",
    timestamps: false
  });

  return RolUsuario;
};
