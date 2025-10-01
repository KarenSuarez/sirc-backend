import db from "../models/index.js";
const Referido = db.refered;

const getAllReferidos = async () => {
  return await Referido.findAll();
};

const getReferidosByReferrer = async (referrerId) => {
  return await Referido.findAll({ where: { referrerId } });
};


const getReferidosNuevos = async () => {
  return await Referido.findAll({ where: { estado: "nuevo" } });
};

const updateEstadoReferido = async (id, nuevoEstado) => {
  const estadosValidos = ["nuevo", "proceso", "convertido"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado inválido");
  }

  const referido = await Referido.findByPk(id);
  if (!referido) {
    throw new Error("Referido no encontrado");
  }

  referido.estado = nuevoEstado;
  await referido.save();

  return referido;
};

export default {
  getAllReferidos,
  getReferidosByReferrer,
  getReferidosNuevos,
  updateEstadoReferido
};