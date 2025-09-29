export default (sequelize, DataTypes) => {
  const RolUsuario = sequelize.define("rolUsuario", {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  });

  return RolUsuario;
};
