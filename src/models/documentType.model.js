// Modelo Sequelize para la tabla Tipo_documento
export default (sequelize, Sequelize) => {
    const TipoDocumento = sequelize.define("Tipo_documento", {
        id_tipo_documento: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Tipo_documento',
        timestamps: false 
    });

    return TipoDocumento;
};
