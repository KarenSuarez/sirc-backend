import db from "../models/index.js";
const SessionHistory = db.historialSesion;

const getProfile = (req, res) => {
  res.status(200).send({
    message: " Perfil de usuario autenticado.",
    userId: req.userId
  });
};

const adminBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Administradores."
  });
};
const showSessions = async (req, res) => {
  console.log(req.body);
  
  try {
    const sessions = await SessionHistory.findAll({
      where: {
        fecha_fin: null
      }
    });
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const referenteBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Referentes."
  });
};

const asesorBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Asesores Internos."
  });
};

const gerenteBoard = (req, res) => {
  res.status(200).send({
    message: " Contenido solo para Gerentes de Ventas."
  });
};

export default {
  getProfile,
  adminBoard,
  referenteBoard,
  asesorBoard,
  gerenteBoard,
  showSessions
};
