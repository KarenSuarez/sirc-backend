import db from "../models/index.js";
const categoria_gamificacion = db.categoria_gamificacion;
const planModelo = db.plan;

const getTodosLosPlanes = () => {
  const planes = planModelo.findAll();
  return planes;
};

const actualizarCategoria = async (id_categoria, datosCategoria) => {
  // Busca la categoría por ID
  const categoria = await categoria_gamificacion.findByPk(id_categoria);
  if (!categoria) {
    return null;
  }
  // Actualiza los campos
  await categoria.update(datosCategoria);
  // Devuelve la categoría actualizada
  return categoria;
};

export default {
  getTodosLosPlanes,
  actualizarCategoria
};