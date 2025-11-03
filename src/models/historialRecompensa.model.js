export default (sequelize, Sequelize) => {
  const Historial_Recompensas = sequelize.define("Historial_Recompensas", {
    id_recompensa: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    numero_documento_identidad: {
      type: Sequelize.STRING(20),
      allowNull: false,
      references: {
        model: "Referente",
        key: "numero_documento_identidad"
      }
    },
    monto: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    cantidad_puntos: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha_movimiento: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    descripcion: {
      type: Sequelize.STRING(255),
      allowNull: true
    }
  }, {
    tableName: "Historial_Recompensas",
    timestamps: false
  });

  return Historial_Recompensas;
};
