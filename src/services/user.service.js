import db from "../models/index.js";
const User = db.usuario;
const SessionHistory = db.historialSesion;

const getLiveSessions = () => {
  const sessions = SessionHistory.findAll({
    where: {
      fecha_fin: null,
    },
  });
  return sessions;
};
const actualizarUsuario = async (id_usuario, datosNuevosUsuario)=>{
  try {
    let usuario = await User.findByPk(id_usuario);
    console.log(JSON.stringify(usuario));
    
    if (!usuario) {
      return null;
    }
    usuario = await usuario.update(datosNuevosUsuario);
    return usuario;
  } catch (error) {
    throw new Error(error);
  }
}
const getAllSessions = () => {
  const sessions = SessionHistory.findAll();
  return sessions;
}
export default {
  getAllSessions,
  getLiveSessions,
  actualizarUsuario
};
