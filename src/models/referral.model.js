// Modelo Sequelize para los Referidos
module.exports = (sequelize, Sequelize) => {
    const Referral = sequelize.define("referrals", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        referredName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'referred_name'
        },
        referredEmail: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            field: 'referred_email'
        },
        status: {
            type: Sequelize.ENUM('pendiente', 'activo', 'convertido'),
            defaultValue: 'pendiente',
            allowNull: false
        }
        // El `referrerId` (ID del referente) se agregará a través de las asociaciones
    });

    return Referral;
};
