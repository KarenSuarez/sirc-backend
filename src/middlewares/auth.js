import { verify } from "jsonwebtoken";
import { secret } from "../config/auth.config.js";
import { user as _user } from "../models";
const User = _user;

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "¡No se proporcionó ningún token!"
    });
  }

  verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "¡No autorizado!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};


// Middleware para verificar si el usuario tiene el rol de Administrador
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                next();
                return;
            }
        }
        res.status(403).send({ message: "¡Requiere rol de Administrador!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Middleware para verificar si el usuario es un referente (interno o externo)
const isReferente = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "referente") {
                next();
                return;
            }
        }
        res.status(403).send({ message: "¡Requiere rol de Referente!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const authMiddleware = {
  verifyToken,
  isAdmin,
  isReferente
};

export default authMiddleware;
