
import db from "../models/index.js";

const Referente = db.referente;
const Referido = db.refered; 
const ConfigPointsPlan = db.configPointsPlan;

export const recalcularPuntosReferentes = async () => {
  try {
    // 1️. Traer configuraciones vigentes de puntos por plan
    const configs = await ConfigPointsPlan.findAll({ where: { vigente: true } });

    // 2️. Traer todos los referentes
    const referentes = await Referente.findAll();

    for (const ref of referentes) {
      // 3️. Buscar los referidos asociados a este referente
      const referidos = await Referido.findAll({
        where: { documento_referente: ref.numero_documento_identidad },
      });

      // 4️. Calcular puntos según el plan de cada referido
      let totalPuntos = 0;
      for (const referido of referidos) {
        const config = configs.find(
          (c) => c.nombre_plan === referido.nombre_plan
        );
        if (config) {
          totalPuntos += config.puntos_por_referido;
        }
      }

      // 5️. Actualizar el total en el referente
      ref.puntos_acumulados = totalPuntos;
      await ref.save();
    }

    console.log(" Recalculo de puntos completado correctamente.");
  } catch (error) {
    console.error(" Error al recalcular puntos:", error);
    throw new Error("Error al recalcular puntos.");
  }
};
