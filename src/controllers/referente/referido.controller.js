import db from "../../models/index.js";
import createLogger from "../../utils/logger.js";

const logger = createLogger("referido.controller");

export const crearReferido = async (req, res) => {
  try {
    const id_referente = req.userId;

    const {
      numero_documento_referido,
      id_tipo_documento,
      nombre_referido,
      apellido_referido,
      correo_referido,
      telefono_referido,
      empresa_referido,
      cargo_referido,
      observaciones,
    } = req.body;

    if (
      !numero_documento_referido ||
      !id_tipo_documento ||
      !nombre_referido ||
      !apellido_referido ||
      !correo_referido ||
      !telefono_referido
    ) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
      });
    }

    const referente = await db.referente.findByPk(id_referente);

    if (!referente) {
      return res.status(403).json({
        message: "El usuario no tiene perfil de referente",
      });
    }

    if (referente.estado_referente !== "activo") {
      return res.status(403).json({
        message: "El perfil de referente no está activo",
      });
    }

    const referidoExistente = await db.referido.findOne({
      where: { numero_documento_referido },
    });

    if (referidoExistente) {
      return res.status(400).json({
        message: "Ya existe un referido con ese número de documento",
      });
    }

    const nuevoReferido = await db.referido.create({
      id_referente,
      numero_documento_referido,
      id_tipo_documento,
      nombre_referido,
      apellido_referido,
      correo_referido,
      telefono_referido,
      empresa_referido: empresa_referido || null,
      cargo_referido: cargo_referido || null,
      estado_referido: "pendiente",
      fecha_referencia: new Date(),
      creado_en: new Date(),
      actualizado_en: new Date(),
      observaciones: observaciones || null,
    });

    logger.info(`Referido creado: ID ${nuevoReferido.id_referido}`);

    return res.status(201).json({
      message: "Referido creado exitosamente",
      referido: nuevoReferido,
    });
  } catch (error) {
    logger.error("Error en crearReferido:", error);
    return res.status(500).json({
      message: "Error al crear referido",
      error: error.message,
    });
  }
};

export const getReferido = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.userId;

    const referido = await db.referido.findByPk(id, {
      include: [
        {
          model: db.plan,
          as: "plan",
        },
        {
          model: db.tipoDocumento,
          as: "tipoDocumento",
        },
      ],
    });

    if (!referido) {
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    if (referido.id_referente !== id_usuario) {
      return res.status(403).json({
        message: "No tienes permiso para ver este referido",
      });
    }

    return res.status(200).json(referido);
  } catch (error) {
    logger.error("Error en getReferido:", error);
    return res.status(500).json({
      message: "Error al obtener referido",
      error: error.message,
    });
  }
};

export const actualizarReferido = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.userId;

    const referido = await db.referido.findByPk(id);

    if (!referido) {
      return res.status(404).json({
        message: "Referido no encontrado",
      });
    }

    if (referido.id_referente !== id_usuario) {
      return res.status(403).json({
        message: "No tienes permiso para modificar este referido",
      });
    }

    const {
      nombre_referido,
      apellido_referido,
      correo_referido,
      telefono_referido,
      empresa_referido,
      cargo_referido,
      observaciones,
    } = req.body;

    await referido.update({
      nombre_referido: nombre_referido || referido.nombre_referido,
      apellido_referido: apellido_referido || referido.apellido_referido,
      correo_referido: correo_referido || referido.correo_referido,
      telefono_referido: telefono_referido || referido.telefono_referido,
      empresa_referido: empresa_referido || referido.empresa_referido,
      cargo_referido: cargo_referido || referido.cargo_referido,
      observaciones: observaciones || referido.observaciones,
      actualizado_en: new Date(),
    });

    logger.info(`Referido actualizado: ID ${id}`);

    return res.status(200).json({
      message: "Referido actualizado exitosamente",
      referido,
    });
  } catch (error) {
    logger.error("Error en actualizarReferido:", error);
    return res.status(500).json({
      message: "Error al actualizar referido",
      error: error.message,
    });
  }
};

export const listarReferidos = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const referidos = await db.referido.findAll({
      where: { id_referente: id_usuario },
      include: [
        {
          model: db.plan,
          as: "plan",
        },
        {
          model: db.tipoDocumento,
          as: "tipoDocumento",
        },
        {
          model: db.usuario,
          as: "asesorVendedor",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      order: [["creado_en", "DESC"]],
    });

    return res.status(200).json(referidos);
  } catch (error) {
    logger.error("Error en listarReferidos:", error);
    return res.status(500).json({
      message: "Error al listar referidos",
      error: error.message,
    });
  }
};

export default {
  crearReferido,
  getReferido,
  actualizarReferido,
  listarReferidos,
};