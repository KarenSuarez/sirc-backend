import db from "../models/index.js";
const SolicitudRecompensa = db.solicitudRecompensa;
const Referente = db.referente;
const Usuario = db.usuario;

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

const obtenerSolicitudPorId = async (id_solicitud) => {
  return await SolicitudRecompensa.findOne({
    where: { id_solicitud },
    include: [
      {
        model: Referente,
        as: "referente",
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["nombre", "apellido", "correo_electronico"],
          },
        ],
      },
      {
        model: Usuario,
        as: "procesado_por",
        attributes: ["nombre", "apellido", "correo_electronico", "numero_documento_identidad"],
      },
    ],
  });
};

const actualizarEstadoSolicitud = async (id, nuevoEstado, observaciones = null, comprobante = null, id_usuario_procesador = null) => {
  const solicitud = await SolicitudRecompensa.findByPk(id);
  if (!solicitud) throw new Error("Solicitud no encontrada");


  solicitud.estado_solicitud = nuevoEstado;
  solicitud.observaciones = observaciones || solicitud.observaciones;
  solicitud.comprobante_pago = comprobante || solicitud.comprobante_pago;


  if (id_usuario_procesador) {
    solicitud.id_usuario_procesador = id_usuario_procesador;
  }

  solicitud.fecha_actualizacion = new Date();

  await solicitud.save();
  if (nuevoEstado === "completada") {
    const referente = await Referente.findByPk(solicitud.documento_referente);
    if (referente) {
      referente.recompensa_monetaria_actual -= solicitud.valor_retirar;
      if (referente.recompensa_monetaria_actual < 0) referente.recompensa_monetaria_actual = 0;
      await referente.save();
    }
  }

  return solicitud;
};




export default {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudesPorReferente,
  obtenerSolicitudPorId,
  actualizarEstadoSolicitud
};
