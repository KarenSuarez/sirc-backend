import db from "../models/index.js";
const Referente = db.referente;
const Historial_nivel = db.historialNivel;
const nivel = db.nivel;
const referidos = db.refered;

const getReferenteByDocumento = async (numero_documento_identidad) => {
  return await Referente.findByPk(numero_documento_identidad);
};

const getNivelActualByDocumento = async (numero_documento_identidad) => {
  const historial = await Historial_nivel.findOne({
    where: { id_referente: numero_documento_identidad },
    order: [['actualizado_en', 'DESC']], // Ordenar por fecha de actualización
    include: [
      {
        model: nivel,
        as: 'nivelAnterior', // Asegúrate de que este alias coincida con tu definición de asociación
      },
    ],
  });

  return historial;
};

const getInformacionNivelById = async (id_nivel) => {
  return await nivel.findByPk(id_nivel);
};

const getInformationNivelesTodos = async () => {
  const nivelesTodos =nivel.findAll({
    order:[
      ['orden', 'ASC']
    ]
  })
  return nivelesTodos;
};
const getMisReferidos =async (numero_documento_identidad)=>{
  const referidosByReferente = await referidos.findAll({
    where: { documento_referente: numero_documento_identidad },
  });
  return referidosByReferente;
}
export default {
  getReferenteByDocumento,
  getNivelActualByDocumento, 
  getInformacionNivelById,
  getInformationNivelesTodos,
  getMisReferidos
};