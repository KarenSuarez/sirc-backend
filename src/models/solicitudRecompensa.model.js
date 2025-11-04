/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudRecompensa:
 *       type: object
 *       properties:
 *         id_solicitud:
 *           type: integer
 *           example: 1
 *         documento_referente:
 *           type: string
 *           example: "1234567890"
 *         valor_retirar:
 *           type: number
 *           format: decimal
 *           example: 50000.00
 *         tipo_banco:
 *           type: string
 *           example: "Bancolombia"
 *         numero_cuenta:
 *           type: string
 *           example: "0123456789"
 *         estado_solicitud:
 *           type: string
 *           enum: [pendiente, en proceso, completada, rechazada]
 *           default: pendiente
 *         tipo_solicitud:
 *           type: string
 *           enum: [Transferencia Bancaria, Bono de Descuento en Plan]
 *           default: Transferencia Bancaria
 *         comprobante_pago:
 *           type: string
 *           nullable: true
 *         observaciones:
 *           type: string
 *           nullable: true
 *         id_usuario_procesador:
 *           type: string
 *           nullable: true
 *         fecha_solicitud:
 *           type: string
 *           format: date-time
 *         fecha_procesamiento:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fecha_actualizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *       required:
 *         - documento_referente
 *         - valor_retirar
 *         - tipo_banco
 *         - numero_cuenta
 */


export default (sequelize, Sequelize) => {
  const SolicitudRecompensa = sequelize.define("Solicitud_Recompensa", {
    id_solicitud: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    documento_referente: {
      type: Sequelize.STRING(20),
      allowNull: false,
      references: {
        model: "Referente",
        key: "numero_documento_identidad",
      }
    },
    valor_retirar: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    tipo_banco: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    numero_cuenta: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    estado_solicitud: {
      type: Sequelize.ENUM("pendiente", "en proceso", "completada", "rechazada"),
      defaultValue: "pendiente"
    },
    tipo_solicitud: {
      type: Sequelize.ENUM("Transferencia Bancaria", "Bono de Descuento en Plan"),
      defaultValue: "Transferencia Bancaria"
    },
    comprobante_pago: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    observaciones: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    id_usuario_procesador: {
      type: Sequelize.STRING(20),
      allowNull: true,
      references: {
        model: "Usuario",
        key: "numero_documento_identidad"
      }
    },
    fecha_solicitud: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    fecha_procesamiento: {
      type: Sequelize.DATE,
      allowNull: true
    },
    fecha_actualizacion: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: "Solicitud_Recompensa",
    timestamps: false
  });

  return SolicitudRecompensa;
};
