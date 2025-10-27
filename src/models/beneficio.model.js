import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Nivel from "./nivel.model.js";

const Beneficio = sequelize.define("Beneficio", {
  id_beneficio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Nivel,
      key: "id_nivel",
    },
  },
  porcentaje_beneficio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: "Porcentaje de beneficio aplicado a la recompensa (ej. 10 = 10%)",
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: "beneficios",
  timestamps: false,
});

Nivel.hasOne(Beneficio, { foreignKey: "id_nivel" });
Beneficio.belongsTo(Nivel, { foreignKey: "id_nivel" });

export default Beneficio;
