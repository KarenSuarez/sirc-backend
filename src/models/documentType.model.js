/**
 * @swagger
 * components:
 *   schemas:
 *     TipoDocumento:
 *       type: object
 *       description: Representa un tipo de documento que puede tener un usuario.
 *       properties:
 *         id_tipo_documento:
 *           type: integer
 *           description: ID único del tipo de documento.
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del tipo de documento.
 *           example: "Cédula de ciudadanía"
 *         descripcion:
 *           type: string
 *           description: Descripción opcional del tipo de documento.
 *           example: "Documento nacional de identidad utilizado en Colombia"
 *       required:
 *         - nombre
 */


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
