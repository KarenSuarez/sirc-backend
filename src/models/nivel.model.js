import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Nivel = sequelize.define("Nivel", {
  id_nivel: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  puntos_minimos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  puntos_maximos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "niveles",
  timestamps: false,
});

export default Nivel;
