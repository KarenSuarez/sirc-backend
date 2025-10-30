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
    const categoriaActual = await referenteService.getCategoriaActualByDocumento(tokenDecoded.documento_id);
    const informacionCategoriaActualReferente = await referenteService.getInformacionCategoriaById(categoriaActual.categoria_nueva);
    res.status(200).send({
      referente: referenteInfo,
      historialActualReferente: categoriaActual,
      informacionCategoriaActualReferente: informacionCategoriaActualReferente
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
export default { 
  referenteBoard,
  infoPerfilReferente  
};
