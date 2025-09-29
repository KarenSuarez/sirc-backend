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
