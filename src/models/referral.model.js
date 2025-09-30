/**
 * @swagger
 * components:
 *   schemas:
 *     Referral:
 *       type: object
 *       description: Representa un referido en el sistema.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del referido.
 *           example: 1
 *         referredName:
 *           type: string
 *           description: Nombre completo del referido.
 *           example: "Juan Pérez"
 *         referredEmail:
 *           type: string
 *           description: Correo electrónico único del referido.
 *           example: "juan.perez@example.com"
 *         status:
 *           type: string
 *           description: Estado del referido en el sistema.
 *           enum:
 *             - pendiente
 *             - activo
 *             - convertido
 *           example: "pendiente"
 *         referrerId:
 *           type: integer
 *           description: ID del usuario que refiere (relación con Usuario).
 *           example: 2
 *       required:
 *         - referredName
 *         - referredEmail
 *         - status
 */




// Modelo Sequelize para los Referidos
export default (sequelize, Sequelize) => {
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
