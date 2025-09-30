/**
 * @swagger
 * components:
 *   schemas:
 *     Refered:
 *       type: object
 *       description: Representa un referido en el sistema.
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del referido.
 *           example: 1
 *         referedName:
 *           type: string
 *           description: Nombre completo del referido.
 *           example: "Juan Pérez"
 *         referedEmail:
 *           type: string
 *           description: Correo electrónico único del referido.
 *           example: "juan.perez@example.com"
 *         referedPhone:
 *           type: string
 *           description: Teléfono del referido.
 *           example: "3101234567"
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
 *         - referedName
 *         - referedEmail
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
        referedName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'nombre_referido'
        },
        referedEmail: {
        type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            field: 'correo_electronico_referido'
        },
        referedPhone: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'telefono_referido'
        },
        updateDate: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'fecha_actualizacion'
        },
        createDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            field: 'fecha_creacion'
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
