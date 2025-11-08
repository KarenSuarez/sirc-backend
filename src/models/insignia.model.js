export default (sequelize, Sequelize) => {
  const Insignia = sequelize.define(
    "Insignia",
    {
      id_insignia: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_insignia: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: {
          name: "unique_nombre_insignia",
          msg: "Ya existe una insignia con ese nombre",
        },
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      icono_insignia: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "Nombre del icono o clase CSS",
      },
      color_insignia: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "#888888",
        comment: "Color en formato hexadecimal",
      },
      criterio_obtencion: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Descripción de cómo se obtiene la insignia",
      },
      rareza: {
        type: Sequelize.ENUM(
          "comun",
          "poco comun",
          "rara",
          "epica",
          "legendaria"
        ),
        defaultValue: "comun",
        comment: "Nivel de rareza de la insignia",
      },
      estado: {
        type: Sequelize.ENUM("activa", "inactiva"),
        defaultValue: "activa",
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
      tableName: "Insignia",
      timestamps: false,
    }
  );

  return Insignia;
};
