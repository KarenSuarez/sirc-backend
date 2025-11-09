export default (sequelize, Sequelize) => {
  const Nivel = sequelize.define(
    "Nivel",
    {
      id_nivel: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_nivel: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: {
          name: "unique_nombre_nivel",
          msg: "El nombre del nivel ya existe",
        },
      },
      orden_nivel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: {
          name: "unique_orden_nivel",
          msg: "El orden del nivel ya existe",
        },
      },
      puntos_minimos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      puntos_maximos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      porcentaje_comision_extra: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      icono_nivel: {
        type: Sequelize.ENUM("trophy", "crown", "star", "fire", "thunderbolt", "rocket", "skin"),
        allowNull: true,
      },
      color_nivel: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },
      beneficios_nivel: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
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
      tableName: "Nivel",
      timestamps: false,
    }
  );

  return Nivel;
};
