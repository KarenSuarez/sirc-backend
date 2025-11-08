export default (sequelize, Sequelize) => {
  const HistorialNivel = sequelize.define(
    "HistorialNivel",
    {
      id_historial: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_referente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Referente",
          key: "id_usuario",
        },
      },
      id_nivel_anterior: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Nivel",
          key: "id_nivel",
        },
      },
      id_nivel_nuevo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Nivel",
          key: "id_nivel",
        },
      },
      puntos_momento: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fecha_cambio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      fecha_vigencia_hasta: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      motivo_cambio: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "HistorialNivel",
      timestamps: false,
    }
  );

  return HistorialNivel;
};
