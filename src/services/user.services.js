import { get } from "http";
import db from "../models/index.js";
const SessionHistory = db.historialSesion;

const getLiveSessions = () => {
  const sessions = SessionHistory.findAll({
    where: {
      fecha_fin: null,
    },
  });
  return sessions;
};
const getAllSessions = () => {
  const sessions = SessionHistory.findAll();
  return sessions;
}
export default {
  getAllSessions,
  getLiveSessions
};
