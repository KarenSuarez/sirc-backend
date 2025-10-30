import db from "../models/index.js";
const categoria_gamificacion = db.categoria_gamificacion;

const getCatalogoPuntosPorCategoria = async (nombreCategoria) => {
    return await categoria_gamificacion.findOne(
      { 
        where: {
          nombre_categoria: nombreCategoria
          } 
      });
};

export default {
    getCatalogoPuntosPorCategoria
};