export default (sequelize, Sequelize) => {
  const TipoDocumento = sequelize.define(
    "TipoDocumento",
    {
      id_tipo_documento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_tipo: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: {
          name: "unique_codigo_tipo",
          msg: "El código de tipo de documento ya existe",
        },
      },
      nombre_tipo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "TipoDocumento",
      timestamps: false,
    }
  );

  return TipoDocumento;
};
