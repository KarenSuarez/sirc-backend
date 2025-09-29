export default (sequelize, Sequelize) => {
    const Rol = sequelize.define("rol", {
        id_rol: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_rol: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT
        }
    }, {
        tableName: 'rol',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    return Rol;
};