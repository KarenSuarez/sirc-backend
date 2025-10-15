import db from "../models/index.js";
const Referido = db.refered;

const getAllReferidos = async () => {
  return await Referido.findAll();
};

const getReferidosByReferrer = async (documento_referente) => {
  return await Referido.findAll({ where: { documento_referente } });
};


const getReferidosEstadoPendiente = async () => {
  return await Referido.findAll({ where: { estado_referido: "pendiente" } });
};

const updateEstadoReferido = async (documento_identidad_referido, nuevoEstado) => {
  const estadosValidos = ["pendiente", "contactado", "activo", "inactivo"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado inválido");
  }

  const referido = await Referido.findByPk(documento_identidad_referido);
  if (!referido) {
    throw new Error("Referido no encontrado");
  }

  const transicionesValidas = {
    pendiente: ["contactado"],
    contactado: ["activo", "inactivo"],
    activo: ["inactivo"],
    inactivo: []
  };

  if (!transicionesValidas[referido.estado_referido].includes(nuevoEstado)) {
    throw new Error(
      `No se puede pasar de '${referido.estado_referido}' a '${nuevoEstado}' directamente`
    );
  }

  const ahora = new Date();

  if (nuevoEstado === "contactado") {
    referido.fecha_primer_contacto = ahora;
  }
  if (nuevoEstado === "activo") {
    referido.fecha_conversion = ahora;
  }

  referido.estado_referido = nuevoEstado;
  referido.actualizado_en = ahora;

  await referido.save();

  return referido;
};


export default {
  getAllReferidos,
  getReferidosByReferrer,
  getReferidosEstadoPendiente,
  updateEstadoReferido
};