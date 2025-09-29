// Modelo Sequelize para la tabla Usuario
export default (sequelize, Sequelize) => {
    const Usuario = sequelize.define("Usuario", {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      correo_electronico: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      contrasena_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      numero_documento_identidad: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      // id_tipo_documento es generado por la asociación
    }, {
      tableName: 'Usuario',
      timestamps: true,
      createdAt: 'fecha_registro',
      updatedAt: false // Si no tienes una columna para updatedAt
    });
  
    return Usuario;
};

