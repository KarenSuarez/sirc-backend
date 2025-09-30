/**
 * @swagger
 * components:
 *   schemas:
 *     Referente:
 *       type: object
 *       description: Representa el perfil de un referente en el sistema.
 *       properties:
 *         id_referente:
 *           type: integer
 *           description: ID único del referente, corresponde al ID del usuario.
 *           example: 1
 *         codigo_referente:
 *           type: string
 *           description: Código de referente, usualmente el número de documento de identidad del usuario.
 *           example: "123456789"
 *         tipo_referente:
 *           type: string
 *           enum: [cliente externo, cliente interno]
 *           description: Tipo de referente.
 *           example: "cliente externo"
 *         puntos_acumulados:
 *           type: integer
 *           description: Puntos acumulados por el referente.
 *           example: 0
 *         categoria_actual:
 *           type: string
 *           enum: [basico]
 *           description: Categoría actual del referente.
 *           example: "basico"
 *         recompensa_monetaria_actual:
 *           type: number
 *           format: float
 *           description: Recompensa monetaria acumulada.
 *           example: 0.00
 *         fecha_ultima_categoria:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de categoría.
 *           example: "2025-09-29T20:00:00Z"
 *         estado_referente:
 *           type: string
 *           enum: [activo, en pausa]
 *           description: Estado actual del referente.
 *           example: "activo"
 */

export default (sequelize, Sequelize) => {
    const Referente = sequelize.define("Referente", {
        id_referente: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'Usuario',
                key: 'id_usuario'
            }
        },
        codigo_referente: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        tipo_referente: {
            type: Sequelize.ENUM('cliente externo', 'cliente interno'),
            defaultValue: 'cliente externo'
        },
        puntos_acumulados: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        categoria_actual: {
            type: Sequelize.ENUM('basico'),
            defaultValue: 'basico'
        },
        recompensa_monetaria_actual: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        fecha_ultima_categoria: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        estado_referente: {
            type: Sequelize.ENUM('activo', 'en pausa'),
            defaultValue: 'activo'
        }
    }, {
        tableName: 'Referente',
        timestamps: false
    });

    return Referente;
};
