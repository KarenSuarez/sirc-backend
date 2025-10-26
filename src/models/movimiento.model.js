export default (sequelize, Sequelize) => {
  const Movimiento = sequelize.define("Movimiento", {
    id_movimiento: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_documento_identidad: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    tipo_movimiento: Sequelize.STRING(50),
    cantidad_puntos: Sequelize.INTEGER,
    monto: Sequelize.DECIMAL(10, 2),
    fecha_movimiento: Sequelize.DATE
  }, {
    tableName: "Movimiento",
    timestamps: false
  });

  return Movimiento;
};
