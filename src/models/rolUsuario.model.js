export default (sequelize, Sequelize) => {
  const RolUsuario = sequelize.define(
    "RolUsuario",
    {
      id_rol_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuario",
          key: "id_usuario",
        },
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Rol",
          key: "id_rol",
        },
      },
    },
    {
      tableName: "RolUsuario",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["id_usuario", "id_rol"],
          name: "unique_usuario_rol",
        },
      ],
    }
  );

  return RolUsuario;
};
