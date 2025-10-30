import rewardRequestService from "../services/rewardRequest.service.js";

const crearSolicitud = async (req, res) => {
  try {
    const documento_referente = req.numero_documento_identidad;
    const { valor_retirar, tipo_banco, numero_cuenta } = req.body;

    if (!valor_retirar || !tipo_banco || !numero_cuenta) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const solicitud = await rewardRequestService.crearSolicitud({
      documento_referente,
      valor_retirar,
      tipo_banco,
      numero_cuenta
    });

    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerTodasLasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await rewardRequestService.obtenerSolicitudes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const obtenerSolicitudesReferente = async (req, res) => {
  try {
    const documento_referente = req.numero_documento_identidad;
    const solicitudes = await rewardRequestService.obtenerSolicitudesPorReferente(documento_referente);
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { id_solicitud } = req.params;
    const { estado_solicitud, comprobante_pago, observaciones } = req.body;

    const solicitud = await rewardRequestService.actualizarEstado(
      id_solicitud,
      estado_solicitud,
      comprobante_pago,
      observaciones
    );

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  crearSolicitud,
  obtenerTodasLasSolicitudes,
  obtenerSolicitudesReferente,
  actualizarEstado
};
