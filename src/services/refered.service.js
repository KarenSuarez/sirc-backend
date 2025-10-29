import db from "../models/index.js";
const Referido = db.refered;

const getAllReferidos = async () => {
  return await Referido.findAll();
};

const getReferidosByReferrer = async (documento_referente) => {
  return await Referido.findAll(
    { 
      where: {
        documento_referente 
        } 
    });
};
const createRefered = async (datosReferido, documentoReferente) => {
  const newRefered = {};
  try {
    const {
      documento_identidad_referido,
      nombre_referido,
      correo_referido,
      telefono_referido,
    } = datosReferido;
    newRefered = await Referido.create({
      documento_identidad_referido,
      nombre_referido,
      correo_referido,
      telefono_referido,
      documento_referente: documentoReferente,
    });
  } catch (error) {
    throw new Error("Error al crear referido\n" + error);
  }
  return newRefered;
};

const getReferidosEstadoPendiente = async () => {
  return await Referido.findAll({
    where: {
      estado_referido: "pendiente",
    },
  });
};

const updateEstadoReferido = async (
  documento_identidad_referido,
  nuevoEstado,
) => {
  const estadosValidos = ["pendiente", "contactado", "activo", "inactivo"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado inválido");
  }
  const referido = await Referido.findByPk(documento_identidad_referido);
  if (!referido) {
    throw new Error("Referido no encontrado");
  }

  referido.estado_referido = nuevoEstado;
  await referido.save();

  return referido;
};

export default {
  createRefered,
  getAllReferidos,
  getReferidosByReferrer,
  getReferidosEstadoPendiente,
  updateEstadoReferido,
};
