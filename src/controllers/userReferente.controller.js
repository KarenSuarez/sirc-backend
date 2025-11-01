import jwt from "jsonwebtoken";
import referenteService from "../services/referente.service.js";
const referenteBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Referentes.",
  });
};
const infoPerfilReferente = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenDecoded = jwt.decode(token);
  try {
    const referenteInfo = await referenteService.getReferenteByDocumento(tokenDecoded.documento_id);
    const nivelActual = await referenteService.getNivelActualByDocumento(tokenDecoded.documento_id);
    const informacionNivelActualReferente = await referenteService.getInformacionNivelById(nivelActual.nivel_nuevo);
    const nivelesTodos = await referenteService.getInformationNivelesTodos();
    res.status(200).send({
      referente: referenteInfo,
      historialActualReferente: nivelActual,
      informacionNivelActualReferente: informacionNivelActualReferente,
      todasLosNiveles: nivelesTodos
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
export default { 
  referenteBoard,
  infoPerfilReferente  
};
