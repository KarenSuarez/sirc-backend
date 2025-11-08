export default (sequelize, Sequelize) => {
  const HistorialSesiones = sequelize.define(
    "HistorialSesiones",
    {
      id_sesion: {
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
      login_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      logout_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "HistorialSesiones",
      timestamps: false,
    }
  );

  return HistorialSesiones;
};
