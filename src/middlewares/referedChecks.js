import db from "../models/index.js";
const Referido = db.refered;

const checkDuplicateReferedEmail = async (req, res, next) => {
  try {
    const refered = await Referido.findOne({ where: { correo_referido: req.body.correo_referido } });
    if (refered) {
      return res.status(400).send({ message: "Error: El correo electrónico del referido ya está en uso." });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export default {
    checkDuplicateReferedEmail
};