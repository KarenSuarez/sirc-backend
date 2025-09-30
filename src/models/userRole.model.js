/**
 * @swagger
 * components:
 *   schemas:
 *     RolUsuario:
 *       type: object
 *       description: Relación muchos a muchos entre Usuario y Rol.
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario.
 *           example: 1
 *         id_rol:
 *           type: integer
 *           description: ID del rol.
 *           example: 2
 *       required:
 *         - id_usuario
 *         - id_rol
 */



export default (sequelize, DataTypes) => {
  const RolUsuario = sequelize.define("RolUsuario", {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuario", 
        key: "id_usuario"
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
