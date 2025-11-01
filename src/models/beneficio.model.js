import { DataTypes } from "sequelize";
import db from "../models/index.js";
const Nivel = db.nivel;
export default (sequelize, Sequelize) => {
  const Beneficio = sequelize.define(
    "Beneficio",
    {
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
        comment:
          "Porcentaje de beneficio aplicado a la recompensa (ej. 10 = 10%)",
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "beneficios",
      timestamps: false,
    },
  );
};
