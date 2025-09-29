// Modelo Sequelize para la tabla intermedia rol_usuario
export default (sequelize, Sequelize) => {
    const RolUsuario = sequelize.define("rol_usuario", {
        fecha_asignacion: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        estado: {
            type: Sequelize.ENUM('activo', 'inactivo'),
            defaultValue: 'activo'
        }
    }, {
        tableName: 'rol_usuario',
        timestamps: false
    });

    return RolUsuario;
};