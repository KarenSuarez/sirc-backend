export default (sequelize, Sequelize) => {

  const Beneficio = sequelize.define(
    "Beneficio",
    {
      id_beneficio: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_nivel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "niveles",
          key: "id_nivel",
        },
      },
      porcentaje_beneficio: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment:
          "Porcentaje de beneficio aplicado a la recompensa (ej. 10 = 10%)",
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "beneficios",
      timestamps: false,
    },
  );
  return Beneficio;
};
