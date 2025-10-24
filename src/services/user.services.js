import db from "../models/index.js";
const SessionHistory = db.historialSesion;

const getAllSessions=()=>{
    const sessions = SessionHistory.findAll({
      where: {
        fecha_fin: null
      }
    });
  return sessions;
}
export default {
  getAllSessions
};