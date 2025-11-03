export default (sequelize, Sequelize) => {
  const HistorialCategoria = sequelize.define("Historial_Categoria", {
    id_cambio: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_referente: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Referente",
        key: "id_referente"
      }
    },
    categoria_anterior: {
      type: Sequelize.ENUM("Bronce", "Plata", "Oro", "Diamante"),
      allowNull: false
    },
    categoria_nueva: {
      type: Sequelize.ENUM("Bronce", "Plata", "Oro", "Diamante"),
      allowNull: false
    },
    puntos_en_momento: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha_cambio: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: "Historial_Categoria",
    timestamps: false
  });

  return HistorialCategoria;
};
