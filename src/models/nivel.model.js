/**
 * @swagger
 * components:
 *   schemas:
 *     nivel:
 *       type: object
 *       properties:
 *         id_nivel:
 *           type: integer
 *           example: 1
 *         nombre_nivel:
 *           type: string
 *           example: "Oro"
 *         puntos_maximos:
 *           type: integer
 *           example: 200
 *         puntos_minimos:
 *           type: integer
 *           example: 100
 *         porcentaje_beneficio_adicional:
 *           type: number
 *           format: float
 *           example: 5.5
 *         descripcion:
 *           type: string
 *           example: "Nivel oro para usuarios destacados"
 *         orden:
 *           type: integer
 *           example: 2
 *         esta_activa:
 *           type: boolean
 *           example: true
 *         creado_en:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T12:00:00Z"
 */
export default (sequelize, Sequelize) => {
  const Nivel = sequelize.define(
    "niveles",
    {
      id_nivel: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre_nivel: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: {
          name: "unique_name_catg",
          msg: "Nombre de la nivel ya existe",
        },
      },
      porcentaje_beneficio_adicional: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      puntos_minimos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      puntos_maximos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: {
          name: "unique_order_catg",
          msg: "Orden de la nivel",
        },
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "niveles",
      timestamps: false,
    },
  );
  return Nivel;
};
