import db from "../models/index.js";
const SolicitudRecompensa = db.solicitudRecompensa;
const Referente = db.referente;

const crearSolicitud = async (data) => {
  const { documento_referente, valor_retirar, tipo_banco, numero_cuenta } = data;

  // Validaciones de negocio
  if (valor_retirar <= 0) {
    throw new Error("El valor a retirar debe ser mayor a 0");
  }

  const bancosValidos = ["Ahorros", "Corriente", "Nequi", "Daviplata", "Otro"];
  if (!bancosValidos.includes(tipo_banco)) {
    throw new Error("Tipo de banco inválido");
  }

  //Validar saldo del referente
  const referente = await Referente.findByPk(documento_referente);
  if (!referente) {
    throw new Error("Referente no encontrado");
  }

  if (valor_retirar > referente.recompensa_monetaria_actual) {
    throw new Error("Saldo insuficiente para realizar la solicitud");
  }

  // Crear solicitud
  const solicitud = await SolicitudRecompensa.create({
    documento_referente,
    valor_retirar,
    tipo_banco,
    numero_cuenta,
    estado_solicitud: "pendiente",
    fecha_solicitud: new Date()
  });

  return solicitud;
};

const obtenerSolicitudes = async () => {
  return await SolicitudRecompensa.findAll();
};

const obtenerSolicitudesPorReferente = async (documento_referente) => {
  return await SolicitudRecompensa.findAll({ where: { documento_referente } });
};

const actualizarEstado = async (id_solicitud, estado_solicitud, comprobante_pago, observaciones) => {
  const solicitud = await SolicitudRecompensa.findByPk(id_solicitud);
  if (!solicitud) throw new Error("Solicitud no encontrada");

  // Actualizar datos generales
  solicitud.estado_solicitud = estado_solicitud;
  solicitud.comprobante_pago = comprobante_pago || solicitud.comprobante_pago;
  solicitud.observaciones = observaciones || solicitud.observaciones;
  solicitud.fecha_actualizacion = new Date();

  // Si la solicitud pasa a "completada", restar el saldo del referente
  if (estado_solicitud === "completada") {
    const referente = await db.referente.findByPk(solicitud.documento_referente);
    if (!referente) throw new Error("Referente no encontrado");

    // Verificar que tenga saldo suficiente antes de descontar
    if (referente.recompensa_monetaria_actual < solicitud.valor_retirar) {
      throw new Error("El referente no tiene suficiente saldo para completar esta solicitud");
    }

    referente.recompensa_monetaria_actual -= solicitud.valor_retirar;
    await referente.save();
  }

  await solicitud.save();
  return solicitud;
};
const rechazarSolicitud = async (id_solicitud, observaciones) => {
  const solicitud = await SolicitudRecompensa.findByPk(id_solicitud);
  if (!solicitud) throw new Error("Solicitud no encontrada");

  solicitud.estado_solicitud = "rechazada";
  solicitud.observaciones = observaciones || solicitud.observaciones;
  solicitud.fecha_actualizacion = new Date();

  await solicitud.save();
  return solicitud;
}
const aprovarSolicitud = async (id_solicitud, comprobante_pago) => {
  const solicitud = await SolicitudRecompensa.findByPk(id_solicitud);
  if (!solicitud) throw new Error("Solicitud no encontrada");

  solicitud.estado_solicitud = "aprobada";
  solicitud.comprobante_pago = comprobante_pago || solicitud.comprobante_pago;
  solicitud.fecha_actualizacion = new Date();

  await solicitud.save();
  return solicitud;
};


export default {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudesPorReferente,
  actualizarEstado,
  rechazarSolicitud,
  aprovarSolicitud
};
