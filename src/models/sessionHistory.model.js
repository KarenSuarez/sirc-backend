/**
 * @swagger
 * components:
 *      schemas:
 *       SessionHistory:
 *         type: object
 *          description: trazability of sessions
 *          properties:
 *          id_sesion
 *          type:
 *          description:
 *           example:
 *          usuario_id:
 *          type:
 *          description:
 *           example:
 *           token:
 *           type:
 * description:
 * type:
 * description:
 * example:
 * fecha_inicio:
 * * type:
 * description:
 * example:
 * fecha_fin:
 * * type:
 * description:
 * example:
 * ip_address:
 * * type:
 * description:
 * example:
 * dispositivo:
 * * type:
 * description:
 * example:
 */
export default (sequelize, Sequelize) => {
  const SessionHistory = sequelize.define(
    "Historial_sesion",
    {
      id_session: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        references: {
          model: "Usuario",
          key: "numero_documento_identidad",
        },
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      fecha_inicio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      dispositivo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "Historial_sesion",
      timestamps: false,
    },
  );

  return SessionHistory;
};
