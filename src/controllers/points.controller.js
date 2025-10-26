import pointsService from "../services/points.service.js";

const consultarPuntos = async (req, res) => {
  try {
    const numero_documento_identidad = req.numero_documento_identidad;
    const data = await pointsService.consultarPuntosReferente(numero_documento_identidad);

    res.status(200).json({
      message: "Consulta exitosa",
      data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  consultarPuntos
};
