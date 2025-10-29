/**
 * @swagger
 * components:
 *   schemas:
 *     HistorialCategoria:
 *       type: object
 *       description: en momentos que el usuario sufra un cambio o actialización de categoria
 *       properties:
 *         id_cambio:
 *           type: integer
 *           description: identificador del cambio
 *           example: 1
 *         id_referente:
 *           type: string
 *           description: documento identidad del referente que sufrio de un cambio de categoria
 *           example: 11
 *         categoria_anterior:
 *           type: integer
 *           description: categoria anterior
 *           example: 1
 *         categoria_nueva:
 *           type: integer
 *           description: nueva categoria
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
  const HistorialCategoria = sequelize.define("Historial_categoria", {
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
        model: "Referente",
        key: "numero_documento_identidad",
      },
    },
    categoria_anterior: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Categoria_gamificacion",
        key: "id_categoria",
      },
    },
    categoria_nueva: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Categoria_gamificacion",
        key: "id_categoria",
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
  });
  return HistorialCategoria;
};
