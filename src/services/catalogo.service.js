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
const actualizarPlan = async (id_plan, datosPlan) => {
  // Busca la categoría por ID
  const planEncontrado = await planModelo.findByPk(id_plan);
  if (!planEncontrado) {
    return null;
  }
  // Actualiza los campos
  await planEncontrado.update(datosPlan);
  // Devuelve la categoría actualizada
  return planEncontrado;
}
const crearPlan = async (datosPlan) => {
  // Crea un nuevo plan con los datos proporcionados
  const nuevoPlan = await planModelo.create(datosPlan);
  return nuevoPlan;
};
export default {
  getTodosLosPlanes,
  actualizarNivel,
  crearPlan,
  actualizarPlan
};