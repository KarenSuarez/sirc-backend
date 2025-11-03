/**
 * @swagger
 * components:
 *   schemas:
 *     Referente:
 *       type: object
 *       description: Representa el perfil de un referente en el sistema.
 *       properties:
 *         numero_documento_identidad:
 *           type: string
 *           description: Número de documento del usuario que actúa como referente.
 *           example: "123456789"
 *         codigo_referente:
 *           type: string
 *           description: Código de referente, usualmente el número de documento de identidad del usuario.
 *           example: "123456789"
 *         tipo_referente:
 *           type: string
 *           enum: [cliente externo, cliente interno]
 *           description: Tipo de referente.
 *           example: "cliente externo"
 *         puntos_acumulados:
 *           type: integer
 *           description: Puntos acumulados por el referente.
 *           example: 0
 *         recompensa_monetaria_actual:
 *           type: number
 *           format: float
 *           description: Recompensa monetaria acumulada.
 *           example: 0.00
 *         fecha_ultima_categoria:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de categoría.
 *           example: "2025-09-29T20:00:00Z"
 *         estado_referente:
 *           type: string
 *           enum: [activo, en pausa]
 *           description: Estado actual del referente.
 *           example: "activo"
 *         required:
 *         - numero_documento
 */

export default (sequelize, Sequelize) => {
  const Referente = sequelize.define(
    "Referente",
    {
      numero_documento_identidad: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        references: {
          model: "Usuario",
          key: "numero_documento_identidad",
        },
      },
      tipo_referente: {
        type: Sequelize.ENUM("cliente externo", "cliente interno"),
        defaultValue: "cliente externo",
      },
      puntos_acumulados: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      recompensa_monetaria_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      fecha_ultima_categoria: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      estado_referente: {
        type: Sequelize.ENUM("activo", "en pausa"),
        defaultValue: "activo",
      },
    },
    {
      tableName: "Referente",
      timestamps: false,
    },
  );

  return Referente;
};
