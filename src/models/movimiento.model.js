export default (sequelize, Sequelize) => {
    const Movimiento = sequelize.define("Movimiento", {
        id_movimiento: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        tipo_movimiento: {
            type: Sequelize.ENUM('NA'), //NA significa Nuevo afiliado
            allowNull: false
        },
        cantidad_puntos: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        monto: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        fecha_movimiento: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        numero_documento_identidad_referente: {
            type: Sequelize.STRING(20),
            allowNull: false,
            references: {
                model: 'Referente',
                key: 'numero_documento_identidad'
            }
        }
    }, {
        tableName: 'Movimiento',
        timestamps: false
    });

    return Movimiento;
}