import db from "../models/index.js";
const SolicitudRecompensa = db.solicitudRecompensa;
const Referente = db.referente;

const crearSolicitud = async (data) => {
  const { documento_referente, valor_retirar, tipo_solicitud, tipo_banco, numero_cuenta } = data;


  if (valor_retirar <= 0) {
    throw new Error("El valor a retirar debe ser mayor a 0");
  }

  const tiposSolicitudValidos = ["Transferencia Bancaria", "Bono de Descuento en Plan"];
  if (!tiposSolicitudValidos.includes(tipo_solicitud)) {
    throw new Error("Tipo de solicitud inválido");
  }


  const referente = await Referente.findByPk(documento_referente);
  if (!referente) {
    throw new Error("Referente no encontrado");
  }

  if (valor_retirar > referente.recompensa_monetaria_actual) {
    throw new Error("Saldo insuficiente para realizar la solicitud");
  }

  const solicitud = await SolicitudRecompensa.create({
    documento_referente,
    valor_retirar,
    tipo_solicitud,
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




export default {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudesPorReferente,
};
