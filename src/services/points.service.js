import db from "../models/index.js";
const Referente = db.referente;
const Movimiento = db.movimiento;

const consultarPuntosReferente = async (numero_documento_identidad) => {
  // Verifica que el referente exista
  const referente = await Referente.findByPk(numero_documento_identidad);
  if (!referente) {
    throw new Error("El referente no existe");
  }

  // Obtiene sus movimientos ordenados por fecha
  const movimientos = await Movimiento.findAll({
    where: { numero_documento_identidad },
    order: [["fecha_movimiento", "DESC"]],
    attributes: [
      "id_movimiento",
      "tipo_movimiento",
      "cantidad_puntos",
      "monto",
      "fecha_movimiento"
    ]
  });

  return {
    puntos_acumulados: referente.puntos_acumulados,
    categoria_actual: referente.categoria_actual,
    recompensa_monetaria_actual: referente.recompensa_monetaria_actual,
    movimientos
  };
};

export default {
  consultarPuntosReferente
};
