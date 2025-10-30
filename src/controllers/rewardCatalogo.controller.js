import referenteService from "../services/referente.service";
import catalogoService from "../services/catalogo.service";

/**
 * @swagger
 * /api/catalogo/categoria:
 *   put:
 *     summary: Actualiza una categoría de gamificación
 *     tags:
 *       - Catalogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaGamificacionUpdate'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGamificacion'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */

const getCatalogo = async (req, res) => {
    try {
        const categorias = await referenteService.getInformationCategoriasTodas()
        const planes = await catalogoService.getTodosLosPlanes()
        //insignias
        if (!categorias) {
            return res.status(404).json({ message: "Categorias vacias" });
        }
        res.status(200).send({
            todasLasCategorias:categorias,
            todosLosPlanes:planes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const {
            id_categoria,
            nombre_nivel,
            orden,
            puntos_minimos,
            porcentaje_beneficio_adicional,
            puntos_maximos,
            descripcion,
            esta_activa
        } = req.body;

        if (!id_categoria) {
            return res.status(400).json({ message: "id_categoria es requerido" });
        }

        // Construir objeto de actualización
        const datosCategoria = {
            nombre_categoria: nombre_nivel,
            orden,
            puntos_minimos,
            porcentaje_beneficio_adicional,
            puntos_maximos,
            descripcion,
            esta_activa,
            updateAt: new Date()
        };

        // Elimina campos undefined
        Object.keys(datosCategoria).forEach(
            key => datosCategoria[key] === undefined && delete datosCategoria[key]
        );

        // Actualizar usando el servicio correspondiente
        const updated = await catalogoService.actualizarCategoria(id_categoria, datosCategoria);

        if (!updated) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export default {
    getCatalogo,
    actualizarCategoria
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaGamificacionUpdate:
 *       type: object
 *       properties:
 *         id_categoria:
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