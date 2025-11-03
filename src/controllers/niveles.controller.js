import db from "../models/index.js";
const Nivel = db.nivel;



/** 
 * @swagger
 * /niveles:
 *   get:
 *     summary: Obtener la lista de niveles
 *     tags: [Niveles]
 *     responses:
 *       200:
 *         description: Lista de niveles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/nivel'
 *       500:
 *         description: Error al listar niveles 
*/
const listarNiveles = async (req, res) => {
  try {
    const niveles = await Nivel.findAll();
    res.json(niveles);
  } catch (error) {
    res.status(500).json({ message: "Error al listar niveles", error: error.message });
  }
};

// POST /api/niveles
const crearNivel = async (req, res) => {
  try {
    const { nombre, descripcion, puntos_minimos, puntos_maximos } = req.body;
    const nuevoNivel = await Nivel.create({ nombre, descripcion, puntos_minimos, puntos_maximos });
    res.status(201).json(nuevoNivel);
  } catch (error) {
    res.status(500).json({ message: "Error al crear nivel", error: error.message });
  }
};

// PUT /api/niveles/:id_nivel
const actualizarNivel = async (req, res) => {
  try {
    const { id_nivel } = req.params;
    const { nombre, descripcion, puntos_minimos, puntos_maximos } = req.body;

    const nivel = await Nivel.findByPk(id_nivel);
    if (!nivel) return res.status(404).json({ message: "Nivel no encontrado" });

    await nivel.update({ nombre, descripcion, puntos_minimos, puntos_maximos });
    res.json({ message: "Nivel actualizado correctamente", nivel });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar nivel", error: error.message });
  }
};
export default {listarNiveles, crearNivel, actualizarNivel};