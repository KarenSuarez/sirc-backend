export default (sequelize, Sequelize) => {
  const Referido = sequelize.define(
    "Referido",
    {
      id_referido: {
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
      id_asesor_vendedor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "ID del asesor de ventas que convirtió al referido",
        references: {
          model: "Usuario",
          key: "id_usuario",
        },
      },
      numero_documento_referido: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: {
          name: "unique_documento_referido",
          msg: "El número de documento del referido ya existe",
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
      nombre_referido: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      apellido_referido: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      correo_referido: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: {
          name: "unique_email_referido",
          msg: "El correo del referido ya existe",
        },
      },
      telefono_referido: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      empresa_referido: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cargo_referido: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      estado_referido: {
        type: Sequelize.ENUM(
          "pendiente",
          "contactado",
          "activo",
          "no_interesado",
          "inactivo"
        ),
        defaultValue: "pendiente",
      },
      id_plan_adquirido: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Plan",
          key: "id_plan",
        },
      },
      fecha_referencia: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      fecha_primer_contacto: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_conversion: {
        type: Sequelize.DATE,
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
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Referido",
      timestamps: false,
    }
  );

  return Referido;
};
