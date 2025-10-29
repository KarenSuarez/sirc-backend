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
    },
    puntos_maximos: {
      type: Sequelize.INTEGER,
    },
    puntos_minimos: {
      type: Sequelize.INTEGER,
    },
    beneficio_adicional_perc: {
      type: Sequelize.DECIMAL(10, 2),
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
  });
  return CategoriaGamificacion;
};
