export default (sequelize, Sequelize) => {
  const MovimientoSaldo = sequelize.define(
    "MovimientoSaldo",
    {
      id_movimiento_saldo: {
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
      tipo_movimiento: {
        type: Sequelize.ENUM(
          "ingreso_comision",
          "egreso_retiro",
          "egreso_bono",
          "ajuste_positivo",
          "ajuste_negativo",
          "vencimiento"
        ),
        allowNull: false,
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      puntos: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      saldo_anterior: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      saldo_nuevo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      puntos_anteriores: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      puntos_nuevos: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      id_solicitud_recompensa: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "SolicitudRecompensa",
          key: "id_solicitud",
        },
      },
      id_movimiento_referencia: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "MovimientoReferencia",
          key: "id_movimiento",
        },
      },
      fecha_movimiento: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Usuario",
          key: "id_usuario",
        },
      },
    },
    {
      tableName: "MovimientoSaldo",
      timestamps: false,
    }
  );

  return MovimientoSaldo;
};
