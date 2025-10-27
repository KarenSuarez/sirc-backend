import Beneficio from "../models/beneficio.model.js";
import Nivel from "../models/nivel.model.js";

// GET /api/beneficios
export const listarBeneficios = async (req, res) => {
  try {
    const beneficios = await Beneficio.findAll({
      include: [{ model: Nivel, attributes: ["nombre", "descripcion"] }],
    });
    res.json(beneficios);
  } catch (error) {
    res.status(500).json({ message: "Error al listar beneficios", error: error.message });
  }
};

// POST /api/beneficios
export const crearBeneficio = async (req, res) => {
  try {
    const { id_nivel, porcentaje_beneficio, descripcion } = req.body;
    const beneficio = await Beneficio.create({ id_nivel, porcentaje_beneficio, descripcion });
    res.status(201).json({ message: "Beneficio creado exitosamente", beneficio });
  } catch (error) {
    res.status(500).json({ message: "Error al crear beneficio", error: error.message });
  }
};

// PUT /api/beneficios/:id_beneficio
export const actualizarBeneficio = async (req, res) => {
  try {
    const { id_beneficio } = req.params;
    const { porcentaje_beneficio, descripcion } = req.body;

    const beneficio = await Beneficio.findByPk(id_beneficio);
    if (!beneficio) return res.status(404).json({ message: "Beneficio no encontrado" });

    await beneficio.update({ porcentaje_beneficio, descripcion });
    res.json({ message: "Beneficio actualizado correctamente", beneficio });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar beneficio", error: error.message });
  }
};
