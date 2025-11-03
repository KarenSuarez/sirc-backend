/**
 * @swagger
 * components:
 *   schemas:
 *     HistorialNivel:
 *       type: object
 *       description: en momentos que el usuario sufra un cambio o actialización de Nivel
 *       properties:
 *         id_cambio:
 *           type: integer
 *           description: identificador del cambio
 *           example: 1
 *         id_referente:
 *           type: string
 *           description: documento identidad del referente que sufrio de un cambio de Nivel
 *           example: 11
 *         Nivel_anterior:
 *           type: integer
 *           description: Nivel anterior
 *           example: 1
 *         Nivel_nueva:
 *           type: integer
 *           description: nueva Nivel
 *           example: 1
 *         puntos_al_momento:
 *           type: double
 *           description: los puntos que en ese momento contaba el referente
 *           example:
 *         actualizado_en:
 *           type: string
 *           format: date
 *           description: fecha de esa actualización
 *           example: "2025-10-28 17:03:00"
 */
export default (sequelize, Sequelize) => {
  const HistorialNivel = sequelize.define("Historial_nivel", {
    id_cambio: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_referente: {
      type: Sequelize.STRING(20),
      allowNull: false,
      references: {
        model: "Referente", // Asegúrate de que este nombre coincida con el nombre de la tabla
        key: "numero_documento_identidad",
      },
    },
    nivel_anterior: {
      type: Sequelize.INTEGER,
      references: {
        model: "niveles",
        key: "id_nivel",
      },
    },
    nivel_nuevo: {
      type: Sequelize.INTEGER,
      references: {
        model: "niveles",
        key: "id_nivel",
      },
    },
    puntos_al_momento: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    actualizado_en: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },{
    tableName:"Historial_nivel",
    timestamps: false
  }
  );
  return HistorialNivel;
};
