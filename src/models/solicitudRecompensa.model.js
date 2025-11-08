export default (sequelize, Sequelize) => {
  const SolicitudRecompensa = sequelize.define(
    "SolicitudRecompensa",
    {
      id_solicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_referente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Referente",
          key: "id_usuario",
        },
      },
      metodo_retiro: {
        type: Sequelize.ENUM("retiro", "bono_pago"),
        defaultValue: "retiro",
      },
      monto_solicitado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      estado_solicitud: {
        type: Sequelize.ENUM(
          "pendiente",
          "en_revision",
          "aprobada",
          "rechazada",
          "procesada",
          "pagada"
        ),
        defaultValue: "pendiente",
      },
      fecha_solicitud: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      fecha_procesamiento: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_usuario_procesa: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Usuario",
          key: "id_usuario",
        },
      },
      cuenta_destino: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      banco_destino: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      comprobante_pago_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      tableName: "SolicitudRecompensa",
      timestamps: false,
    }
  );

  return SolicitudRecompensa;
};
