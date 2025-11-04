import db from "../models/index.js";
const Nivel = db.nivel;

/**
 * @swagger
 * components:
 *   schemas:
 *     nivel:
 *       type: object
 *       properties:
 *         id_nivel:
 *           type: integer
 *           example: 1
 *         nombre_nivel:
 *           type: string
 *           example: "Nivel 1"
 *         porcentaje_beneficio_adicional:
 *           type: number
 *           format: float
 *           example: 5.0
 *         descripcion:
 *           type: string
 *           example: "Nivel inicial de puntos"
 *         puntos_minimos:
 *           type: integer
 *           example: 0
 *         puntos_maximos:
 *           type: integer
 *           example: 100
 *         orden:
 *           type: integer
 *           example: 1
 *         activo:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /niveles:
 *   get:
 *     summary: Listar todos los niveles
 *     tags: [Niveles]
 *     responses:
 *       200:
 *         description: Lista de todos los niveles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/nivel'
 *       500:
 *         description: Error al listar niveles
 */

/**
 * @swagger
 * /niveles/activos:
 *   get:
 *     summary: Listar solo los niveles activos
 *     tags: [Niveles]
 *     responses:
 *       200:
 *         description: Lista de niveles activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/nivel'
 *       500:
 *         description: Error al listar niveles activos
 */

/**
 * @swagger
 * /niveles:
 *   post:
 *     summary: Crear un nuevo nivel
 *     tags: [Niveles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_nivel
 *               - puntos_minimos
 *               - puntos_maximos
 *               - orden
 *             properties:
 *               nombre_nivel:
 *                 type: string
 *                 example: "Nivel 2"
 *               porcentaje_beneficio_adicional:
 *                 type: number
 *                 example: 5.0
 *               descripcion:
 *                 type: string
 *                 example: "Nivel intermedio"
 *               puntos_minimos:
 *                 type: integer
 *                 example: 101
 *               puntos_maximos:
 *                 type: integer
 *                 example: 200
 *               orden:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Nivel creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/nivel'
 *       500:
 *         description: Error al crear nivel
 */

/**
 * @swagger
 * /niveles/{id_nivel}:
 *   put:
 *     summary: Actualizar un nivel existente
 *     tags: [Niveles]
 *     parameters:
 *       - in: path
 *         name: id_nivel
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_nivel:
 *                 type: string
 *               porcentaje_beneficio_adicional:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               puntos_minimos:
 *                 type: integer
 *               puntos_maximos:
 *                 type: integer
 *               orden:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Nivel actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nivel actualizado correctamente"
 *                 nivel:
 *                   $ref: '#/components/schemas/nivel'
 *       404:
 *         description: Nivel no encontrado
 *       500:
 *         description: Error al actualizar nivel
 */

/**
 * @swagger
 * /niveles/{id_nivel}:
 *   delete:
 *     summary: Desactivar un nivel 
 *     tags: [Niveles]
 *     parameters:
 *       - in: path
 *         name: id_nivel
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel a desactivar
 *     responses:
 *       200:
 *         description: Nivel desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nivel desactivado correctamente"
 *                 nivel:
 *                   $ref: '#/components/schemas/nivel'
 *       404:
 *         description: Nivel no encontrado
 *       500:
 *         description: Error al desactivar nivel
 */


const listarNiveles = async (req, res) => {
  try {
    const niveles = await Nivel.findAll();
    res.json(niveles);
  } catch (error) {
    res.status(500).json({ message: "Error al listar niveles", error: error.message });
  }
};

const listarNivelesActivos = async (req, res) => {
  try {
    const niveles = await Nivel.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']],
    });

    res.json(niveles);
  } catch (error) {
    res.status(500).json({ message: "Error al listar niveles activos", error: error.message });
  }
};



const crearNivel = async (req, res) => {
  try {
    const { nombre_nivel, porcentaje_beneficio_adicional, descripcion, puntos_minimos, puntos_maximos, orden } = req.body;
    const nuevoNivel = await Nivel.create({ nombre_nivel,porcentaje_beneficio_adicional, descripcion, puntos_minimos, puntos_maximos, orden });
    res.status(201).json(nuevoNivel);
  } catch (error) {
    res.status(500).json({ message: "Error al crear nivel", error: error.message });
  }
};


const actualizarNivel = async (req, res) => {
  try {
    const { id_nivel } = req.params;
    const { nombre_nivel, porcentaje_beneficio_adicional, descripcion, puntos_minimos, puntos_maximos, orden } = req.body;

    const nivel = await Nivel.findByPk(id_nivel);
    if (!nivel) return res.status(404).json({ message: "Nivel no encontrado" });

    await nivel.update({ nombre_nivel, porcentaje_beneficio_adicional, descripcion, puntos_minimos, puntos_maximos, orden });
    res.json({ message: "Nivel actualizado correctamente", nivel });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar nivel", error: error.message });
  }
};

const eliminarNivel = async (req, res) => {
  try {
    const { id_nivel } = req.params;

    const nivel = await Nivel.findByPk(id_nivel);
    if (!nivel) return res.status(404).json({ message: "Nivel no encontrado" });

    nivel.activo = false;
    await nivel.save();

    res.json({ message: "Nivel desactivado correctamente", nivel });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar nivel", error: error.message });
  }
};



export default {listarNiveles,listarNivelesActivos, crearNivel, actualizarNivel, eliminarNivel};