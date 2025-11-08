export default (sequelize, Sequelize) => {
  const InsigniaReferente = sequelize.define(
    "InsigniaReferente",
    {
      id_insignia_referente: {
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
      id_insignia: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Insignia",
          key: "id_insignia",
        },
      },
      fecha_obtencion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      notificado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "Si el referente fue notificado de la insignia obtenida",
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      tableName: "InsigniaReferente",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["id_referente", "id_insignia"],
          name: "unique_insignia_referente",
        },
      ],
    }
  );

  return InsigniaReferente;
};
