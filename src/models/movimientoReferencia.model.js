export default (sequelize, Sequelize) => {
  const MovimientoReferencia = sequelize.define(
    "MovimientoReferencia",
    {
      id_movimiento: {
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
      id_referido: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Referido",
          key: "id_referido",
        },
      },
      precio_plan_momento: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      porcentaje_comision_base: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      porcentaje_comision_nivel: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      porcentaje_comision_total: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      monto_comision: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      puntos_otorgados: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      estado_comision: {
        type: Sequelize.ENUM("pendiente", "pagada", "vencida", "cancelada"),
        defaultValue: "pendiente",
      },
      fecha_movimiento: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      fecha_vencimiento: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      tableName: "MovimientoReferencia",
      timestamps: false,
    }
  );

  return MovimientoReferencia;
};
