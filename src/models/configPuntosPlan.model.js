import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const ConfigPuntosPlan = sequelize.define(
    "ConfigPuntosPlan",
    {
      id_config: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_plan: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      puntos_por_referido: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vigente: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
}, {
      tableName: "config_puntos_plan",
      timestamps: false,
    },
  );
};
