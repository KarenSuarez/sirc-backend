
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
  gerenteBoard
};
