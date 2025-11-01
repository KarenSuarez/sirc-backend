import db from "../models/index.js";
const nivelModelo = db.nivel;
const planModelo = db.plan;

const getTodosLosPlanes = () => {
  const planes = planModelo.findAll();
  return planes;
};

const actualizarNivel = async (id_nivel, datosNivel) => {
  // Busca la categoría por ID
  const nivelEncontrado = await nivelModelo.findByPk(id_nivel);
  if (!nivelEncontrado) {
    return null;
  }
  // Actualiza los campos
  await nivelEncontrado.update(datosNivel);
  // Devuelve la categoría actualizada
  return nivelEncontrado;
};

export default {
  getTodosLosPlanes,
  actualizarNivel
};