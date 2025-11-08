export default (sequelize, Sequelize) => {
  const Rol = sequelize.define(
    "Rol",
    {
      id_rol: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_rol: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: {
          name: "unique_codigo_rol",
          msg: "El código de rol ya existe",
        },
      },
      nombre_rol: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Rol",
      timestamps: false,
    }
  );

  return Rol;
};
