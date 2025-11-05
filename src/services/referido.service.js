import db from "../models/index.js";
const Referido = db.refered;
const Plan = db.plan;
const Referente = db.referente;

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
  let newRefered = {};
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
    throw new Error("Error al crear referido " + error);
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

export const updateEstadoReferido = async (documento_identidad_referido, nuevoEstado, idPlanAdquirido) => {
  const referido = await Referido.findByPk(documento_identidad_referido);
  if (!referido) throw new Error("Referido no encontrado");


  const transicionesValidas = {
    pendiente: ["contactado"],
    contactado: ["activo", "inactivo"],
    activo: ["inactivo"],
    inactivo: []
  };
  if (!transicionesValidas[referido.estado_referido].includes(nuevoEstado)) {
    throw new Error(`No se puede pasar de '${referido.estado_referido}' a '${nuevoEstado}'`);
  }

  const ahora = new Date();


  if (nuevoEstado === "contactado") referido.fecha_primer_contacto = ahora;
  if (nuevoEstado === "activo") referido.fecha_conversion = ahora;


  if (nuevoEstado === "activo" && idPlanAdquirido) {
    referido.id_plan_adquirido = idPlanAdquirido;

    const plan = await Plan.findByPk(idPlanAdquirido);
    if (!plan) throw new Error("Plan no encontrado");

    const referente = await Referente.findOne({
      where: { numero_documento_identidad: referido.documento_referente }
    });
    if (!referente) throw new Error("Referente no encontrado");

    const recompensa = Number(plan.precio_actual) * (Number(plan.porcentaje_recompensa) / 100);


    referente.recompensa_monetaria_actual = (referente.recompensa_monetaria_actual || 0) + recompensa;
    referente.puntos_acumulados = (referente.puntos_acumulados || 0) + Number(plan.puntos_otorgados);
    referente.actualizado_en = ahora;
    await referente.save();


    referido.puntos_generados = Number(plan.puntos_otorgados);
    referido.recompensa_generada = recompensa;
  }

  referido.estado_referido = nuevoEstado;
  referido.actualizado_en = ahora;
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