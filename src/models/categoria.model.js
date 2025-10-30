/** @swagger 
components:
schemas:
CategoriaGamificacion
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
