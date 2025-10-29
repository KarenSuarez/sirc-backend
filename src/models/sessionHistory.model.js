/**
 * @swagger
 * components:
 *   schemas:
 *     SessionHistory:
 *       type: object
 *       description: Trazability of sessions
 *       properties:
 *         id_session:
 *           type: integer
 *           description: Unique identifier for the session
 *           example: 1
 *         usuario_id:
 *           type: string
 *           description: Identifier of the user
 *           example: "123456789"
 *         token:
 *           type: string
 *           description: Token used for the session
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the session
 *           example: "2023-01-01T12:00:00Z"
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *           description: End date and time of the session
 *           example: "2023-01-01T14:00:00Z"
 *         ip_address:
 *           type: string
 *           description: IP address of the user during the session
 *           example: "192.168.1.1"
 *         dispositivo:
 *           type: string
 *           description: Device used during the session
 *           example: "Laptop"
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
