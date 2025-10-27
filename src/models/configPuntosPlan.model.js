import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ConfigPuntosPlan = sequelize.define("ConfigPuntosPlan", {
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
});

export default ConfigPuntosPlan;
