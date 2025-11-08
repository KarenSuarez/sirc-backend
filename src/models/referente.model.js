export default (sequelize, Sequelize) => {
  const Referente = sequelize.define(
    "Referente",
    {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Usuario",
          key: "id_usuario",
        },
      },
      codigo_referente: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: {
          name: "unique_codigo_referente",
          msg: "El código de referente ya existe",
        },
      },
      tipo_referente: {
        type: Sequelize.ENUM("cliente_interno", "cliente_externo"),
        defaultValue: "cliente_externo",
      },
      puntos_actuales: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      puntos_totales_historico: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      saldo_disponible: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      total_comisiones_historico: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      total_retirado: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      estado_referente: {
        type: Sequelize.ENUM("activo", "inactivo", "suspendido"),
        defaultValue: "activo",
      },
      fecha_ultima_actividad: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      tableName: "Referente",
      timestamps: false,
    }
  );

  return Referente;
};
