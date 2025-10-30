import { DataTypes } from '@sequelize/core';
/** 
 * @swagger 
 * components:
 *   schemas:
 *     CategoriaGamificacion:
 *       type: object
 *       properties:
 *         id_categoria:
 *           type: integer
 *           example: 1
 *         nombre_categoria:
 *           type: string
 *           example: "Oro"
 *         puntos_maximos:
 *           type: integer
 *           example: 200
 *         puntos_minimos:
 *           type: integer
 *           example: 100
 *         porcentaje_beneficio_adicional:
 *           type: number
 *           format: float
 *           example: 5.5
 *         descripcion:
 *           type: string
 *           example: "Nivel oro para usuarios destacados"
 *         orden:
 *           type: integer
 *           example: 2
 *         esta_activa:
 *           type: boolean
 *           example: true
 *         creado_en:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T12:00:00Z"
 */
export default (sequelize, Sequelize) => {
  const CategoriaGamificacion = sequelize.define("Categoria_gamificacion", {
    id_categoria: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_categoria: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: {
        name: "unique_name_catg",
        msg: "Nombre de la categoria ya existe",
      }
    },
    puntos_maximos: {
      type: Sequelize.INTEGER,
    },
    puntos_minimos: {
      type: Sequelize.INTEGER,
    },
    porcentaje_beneficio_adicional: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0.0
    },
    descripcion: {
      type: Sequelize.TEXT,
    },
    orden:{
      type: Sequelize.INTEGER,
      allowNull:false,
      unique: {
          name: "unique_order_catg",
          msg: "Orden de la categoria",
        }
    },
    esta_activa:{
      type: DataTypes.BOOLEAN,
      defaultValue:true
    },
    creado_en: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'categoria_gamificacion', // Cambia el nombre de la tabla aquí
  }
  );
  return CategoriaGamificacion;
};
