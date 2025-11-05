import db from "../models/index.js";
const nivelModelo = db.nivel;
const planModelo = db.plan;

const getTodosLosPlanes = () => {
  const planes = planModelo.findAll();
  return planes;
};

export default {
  getTodosLosPlanes
};