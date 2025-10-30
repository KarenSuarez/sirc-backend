import db from "../models/index.js";
const Referente = db.referente;
const Historial_categoria = db.historialCateogoria;
const CategoriaGamificacion = db.categoriaGam;

const getReferenteByDocumento = async (numero_documento_identidad) => {
  return await Referente.findByPk(numero_documento_identidad);
};

const getCategoriaActualByDocumento = async (numero_documento_identidad) => {
  const historial = await Historial_categoria.findOne({
    where: { id_referente: numero_documento_identidad },
    order: [['actualizado_en', 'DESC']], // Ordenar por fecha de actualización
    include: [
      {
        model: CategoriaGamificacion,
        as: 'categoriaAnterior', // Asegúrate de que este alias coincida con tu definición de asociación
      },
    ],
  });

  return historial;
};

const getInformacionCategoriaById = async (id_categoria) => {
  return await CategoriaGamificacion.findByPk(id_categoria);
};

const getInformationCategoriasTodas = async () => {
  CategoriaGamificacion.findAll({
    order:[
      ['orden', 'DESC']
    ]
  })
};

export default {
  getReferenteByDocumento,
  getCategoriaActualByDocumento, 
  getInformacionCategoriaById,
  getInformationCategoriasTodas
};