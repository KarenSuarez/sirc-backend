import referenteService from "../services/referente.service.js";
import catalogoService from "../services/catalogo.service.js";

/**
 * @swagger
 * /api/catalogo/nivel:
 *   put:
 *     summary: Actualiza una categoría de gamificación
 *     tags:
 *       - Catalogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NivelesUpdate'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/nivel'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */

const getCatalogo = async (req, res) => {
    try {
        const niveles = await referenteService.getInformationNivelesTodos()
        const planes = await catalogoService.getTodosLosPlanes()
        //insignias
        if (!niveles) {
            return res.status(404).json({ message: "niveles vacios" });
        }
        res.status(200).send({
            todasLosniveles:niveles,
            todosLosPlanes:planes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @swagger
 * components:
 *   schemas:
 *     NivelesUpdate:
 *       type: object
 *       properties:
 *         id_nivel:
 *           type: integer
 *           description: ID de la categoría a actualizar
 *           example: 1
 *         nombre_nivel:
 *           type: string
 *           description: Nuevo nombre de la categoría
 *           example: "Oro"
 *         orden:
 *           type: integer
 *           description: Nuevo orden de la categoría
 *           example: 2
 *         puntos_minimos:
 *           type: integer
 *           description: Puntos mínimos requeridos
 *           example: 100
 *         puntos_maximos:
 *           type: integer
 *           description: Puntos máximos permitidos
 *           example: 200
 *         porcentaje_beneficio_adicional:
 *           type: number
 *           format: float
 *           description: Porcentaje de beneficio adicional
 *           example: 5.5
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *           example: "Nivel oro para usuarios destacados"
 *         esta_activa:
 *           type: boolean
 *           description: Si la categoría está activa
 *           example: true
 */
const actualizarNivel = async (req, res) => {
    try {
        const {
            id_nivel,
            nombre_nivel,
            orden,
            puntos_minimos,
            porcentaje_beneficio_adicional,
            puntos_maximos,
            descripcion,
            esta_activa
        } = req.body;

        if (!id_nivel) {
            return res.status(400).json({ message: "id_nivel es requerido" });
        }

        // Construir objeto de actualización
        const datosNivel = {
            nombre_nivel,
            orden,
            puntos_minimos,
            porcentaje_beneficio_adicional,
            puntos_maximos,
            descripcion,
            esta_activa,
            updateAt: new Date()
        };

        // Elimina campos undefined
        Object.keys(datosNivel).forEach(
            key => datosNivel[key] === undefined && delete datosNivel[key]
        );

        // Actualizar usando el servicio correspondiente
        const updated = await catalogoService.actualizarNivel(id_nivel, datosNivel);

        if (!updated) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.log(req.body);
        res.status(500).send({ message: error.message });
    }
};

export default {
    getCatalogo,
    actualizarNivel
};

