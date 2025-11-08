export default (sequelize, Sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero_documento: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: {
          name: "unique_numero_documento",
          msg: "El número de documento ya existe",
        },
      },
      id_tipo_documento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TipoDocumento",
          key: "id_tipo_documento",
        },
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      correo_electronico: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: {
          name: "unique_email",
          msg: "El correo electrónico ya existe",
        },
      },
      contrasena_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fecha_registro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
      tableName: "Usuario",
      timestamps: false,
    }
  );

  return Usuario;
};
