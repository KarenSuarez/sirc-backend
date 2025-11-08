export default (sequelize, Sequelize) => {
  const Plan = sequelize.define(
    "Plan",
    {
      id_plan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_plan: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      precio_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      porcentaje_comision_base: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      puntos_otorgados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      estado_plan: {
        type: Sequelize.ENUM("activo", "inactivo"),
        defaultValue: "activo",
      },
      icono_plan: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      color_plan: {
        type: Sequelize.STRING(7),
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
      tableName: "Plan",
      timestamps: false,
    }
  );

  return Plan;
};
