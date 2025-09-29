import authService from "../services/auth.service.js";
import db from "../models/index.js";
const Usuario = db.usuario;

// Middleware para verificar duplicados
const checkDuplicateEmailOrDocument = async (req, res, next) => {
    try {
        // Verificar correo electrónico
        let user = await Usuario.findOne({ where: { correo_electronico: req.body.correo_electronico } });
        if (user) {
            return res.status(400).send({ message: "Error: El correo electrónico ya está en uso." });
        }

        // Verificar número de documento
        user = await Usuario.findOne({ where: { numero_documento_identidad: req.body.numero_documento_identidad } });
        if (user) {
            return res.status(400).send({ message: "Error: El número de documento ya está registrado." });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


// Controlador para registrar un nuevo usuario
const register = async (req, res) => {
  try {
    // Llama al servicio para manejar la lógica de negocio
    await authService.registerUser(req.body);
    
    res.status(201).send({ message: "¡Usuario registrado exitosamente!" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// ... Aquí iría el controlador de login

export default {
    register,
    checkDuplicateEmailOrDocument
};

