/**
 * @swagger
 * components:
 *   schemas:
 *     Movimiento:
 *       type: object
 *       description: el movimiento que realiza un usuario
 *       properties:
 *         id_movimiento:
 *           type: integer
 *           description: identificador
 *           example: 1
 *         tipo_movimiento:
 *           type:
 *           description:
 *           example:
 *         cantidad_puntos:
 *           type:
 *           description:
 *           example:
 *         monto:
 *           type:
 *           description:
 *           example:
 *         fecha_movimiento:
 *           type:
 *           description:
 *           example:
 *         numero_documento_identidad_referente:
 *           type:
 *           description:
 *           example:
 */
export default (sequelize, Sequelize) => {
  const Movimiento = sequelize.define(
    "Movimiento",
    {
      id_movimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipo_movimiento: {
        type: Sequelize.ENUM("NA", "PE", "RE"), //NA->Nuevo afiliado; PE->pendiente; RE -> rechazado
        allowNull: false,
      },
      cantidad_puntos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      fecha_movimiento: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    numero_documento_identidad: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: "Referente",
          key: "numero_documento_identidad",
        },
      },
    tipo_movimiento: Sequelize.STRING(50),
    cantidad_puntos: Sequelize.INTEGER,
    monto: Sequelize.DECIMAL(10, 2),
    fecha_movimiento: Sequelize.DATE    
    }, {
      tableName: "Movimiento",
      timestamps: false
    });

  return Movimiento;
};
