export default (sequelize, Sequelize) => {
  const SolicitudRecompensa = sequelize.define("SolicitudRecompensa", {
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
      type: Sequelize.ENUM("Ahorros", "Corriente", "Nequi", "Daviplata", "Otro"),
      allowNull: false
    },
    numero_cuenta: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    estado_solicitud: {
      type: Sequelize.ENUM("pendiente", "en_proceso", "completada", "rechazada"),
      defaultValue: "pendiente"
    },
    tipo_solicitud: {
      type: Sequelize.ENUM("retiro", "bono_descuento"),
      defaultValue: "retiro"
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
