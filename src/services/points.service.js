import db from "../models/index.js";
const Referente = db.referente;
const Referido = db.refered;
const PlanesClarisa = db.plan;

const consultarPuntosReferente = async (numero_documento_identidad) => {
  const referente = await Referente.findByPk(numero_documento_identidad, {
    attributes: ["puntos_acumulados"]
  });

  if (!referente) {
    throw new Error("El referente no existe");
  }

  return {
    puntos_acumulados: referente.puntos_acumulados
  };
};

const recalcularPuntosReferentes = async () => {
  try {

    const planes = await PlanesClarisa.findAll({ where: { estado: 'activo' } });

    const referentes = await Referente.findAll();

    for (const ref of referentes) {

      const referidos = await Referido.findAll({
        where: {
          documento_referente: ref.numero_documento_identidad,
          estado_referido: "activo"
        },
      });

      const totalPuntos = referidos.reduce((acc, r) => {
        const plan = planes.find(p => p.id_plan === r.id_plan_adquirido);
        return acc + (plan ? Number(plan.puntos_otorgados) : 0);
      }, 0);


      ref.puntos_acumulados = totalPuntos;
      ref.actualizado_en = new Date();
      await ref.save();
    }

    console.log("Recalculo de puntos completado correctamente.");
    return { message: "Recalculo de puntos completado." };

  } catch (error) {
    console.error("Error al recalcular puntos:", error);
    throw new Error("Error al recalcular puntos.");
  }
};

export default {
  consultarPuntosReferente,
  recalcularPuntosReferentes
};
