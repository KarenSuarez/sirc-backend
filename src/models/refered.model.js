/**
 * @swagger
 * components:
 *   schemas:
 *     Referido:
 *       type: object
 *       description: Representa un referido en el sistema.
 *       properties:
 *         documento_identidad_referido:
 *           type: string
 *           description: Número de documento de identidad del referido (clave primaria).
 *           example: "1234567890"
 *         id_tipo_documento:
 *           type: integer
 *           description: ID del tipo de documento asociado.
 *           example: 1
 *         nombre_referido:
 *           type: string
 *           description: Nombre completo del referido.
 *           example: "Juan Pérez"
 *         correo_referido:
 *           type: string
 *           description: Correo electrónico único del referido.
 *           example: "juan.perez@example.com"
 *         telefono_referido:
 *           type: string
 *           description: Teléfono de contacto del referido.
 *           example: "3101234567"
 *         empresa_referido:
 *           type: string
 *           description: Empresa asociada al referido.
 *           example: "Tech Solutions S.A."
 *         estado_referido:
 *           type: string
 *           enum: [pendiente, contactado, activo, inactivo]
 *           description: Estado actual del referido en el sistema.
 *           example: "pendiente"
 *         id_plan_adquirido:
 *           type: integer
 *           description: ID del plan adquirido (si aplica).
 *           example: 2
 *         fecha_referencia:
 *           type: string
 *           format: date-time
 *           description: Fecha en que fue registrado el referido.
 *           example: "2025-09-29T20:00:00Z"
 *         fecha_primer_contacto:
 *           type: string
 *           format: date-time
 *           description: Fecha del primer contacto con el referido.
 *           example: "2025-10-02T18:00:00Z"
 *         fecha_conversion:
 *           type: string
 *           format: date-time
 *           description: Fecha en que el referido se convirtió en cliente.
 *           example: "2025-10-05T20:00:00Z"
 *         recompensa_generada:
 *           type: number
 *           format: float
 *           description: Valor monetario de la recompensa generada.
 *           example: 15000.00
 *         puntos_generados:
 *           type: integer
 *           description: Puntos obtenidos por el referido.
 *           example: 50
 *         documento_referente:
 *           type: string
 *           description: Documento del referente (relación con la tabla Referente o Usuario).
 *           example: "987654321"
 *         creado_en:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro.
 *           example: "2025-09-29T20:00:00Z"
 *         actualizado_en:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización.
 *           example: "2025-09-30T20:00:00Z"
 *       required:
 *         - documento_identidad_referido
 *         - id_tipo_documento
 *         - nombre_referido
 *         - correo_referido
 *         - telefono_referido
 *         - documento_referente
 */

export default (sequelize, Sequelize) => {
  const Referido = sequelize.define(
    "Referido",
    {
      documento_identidad_referido: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      nombre_referido: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      correo_referido: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: {
          name: "unique_email_referido",
          msg: "Email already exists",
        },
      },
      telefono_referido: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      empresa_referido: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      estado_referido: {
        type: Sequelize.ENUM("pendiente", "contactado", "activo", "inactivo"),
        defaultValue: "pendiente",
      },
      id_plan_adquirido: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Plan",
          key: "id_plan",
        },
      },
      fecha_referencia: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      fecha_primer_contacto: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_conversion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      recompensa_generada: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      puntos_generados: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      documento_referente: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: "Referente",
          key: "numero_documento_identidad",
        },
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Referido",
      timestamps: false,
    },
  );

  return Referido;
};
