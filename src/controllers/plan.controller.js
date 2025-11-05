import db from "../models/index.js";
const Plan = db.plan;
import pointsService from "../services/points.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Plan:
 *       type: object
 *       required:
 *         - nombre_plan
 *         - precio_actual
 *         - porcentaje_recompensa
 *         - puntos_otorgados
 *       properties:
 *         id_plan:
 *           type: integer
 *           description: ID del plan
 *         nombre_plan:
 *           type: string
 *           description: Nombre del plan
 *         precio_actual:
 *           type: number
 *           format: float
 *           description: Precio actual del plan
 *         porcentaje_recompensa:
 *           type: number
 *           format: float
 *           description: Porcentaje de recompensa
 *         puntos_otorgados:
 *           type: integer
 *           description: Puntos otorgados por el plan
 *         descripcion:
 *           type: string
 *           description: Descripción del plan
 *         estado:
 *           type: string
 *           enum: [activo, inactivo, eliminado]
 *           description: Estado del plan
 *         creado_en:
 *           type: string
 *           format: date-time
 *         actualizado_en:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /planes:
 *   post:
 *     summary: Crear un nuevo plan
 *     tags: [Planes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       201:
 *         description: Plan creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Error al crear el plan
 */

/**
 * @swagger
 * /planes/{id_plan}:
 *   put:
 *     summary: Actualizar un plan existente
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id_plan
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del plan a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error al actualizar el plan
 */

/**
 * @swagger
 * /planes/{id_plan}:
 *   delete:
 *     summary: Desactivar un plan (cambiar estado)
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id_plan
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del plan a desactivar
 *     responses:
 *       200:
 *         description: Plan desactivado correctamente
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error al eliminar el plan
 */


export const crearPlan = async (req, res) => {
    try {
        const { nombre_plan, precio_actual, porcentaje_recompensa, puntos_otorgados, descripcion } = req.body;

        const nuevoPlan = await Plan.create({
            nombre_plan,
            precio_actual,
            porcentaje_recompensa,
            puntos_otorgados,
            descripcion,
            estado: 'activo',
            creado_en: new Date(),
            actualizado_en: new Date()
        });

        return res.status(201).json(nuevoPlan);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error al crear el plan", error });
    }
};

export const actualizarPlan = async (req, res) => {
    try {
        const { id_plan } = req.params;
        const { nombre_plan, precio_actual, porcentaje_recompensa, puntos_otorgados, descripcion, estado } = req.body;

        const plan = await Plan.findByPk(id_plan);

        if (!plan) {
            return res.status(404).json({ mensaje: "Plan no encontrado" });
        }

        await plan.update({
            nombre_plan,
            precio_actual,
            porcentaje_recompensa,
            puntos_otorgados,
            descripcion,
            estado,
            actualizado_en: new Date()
        });

        if (req.body.puntos_otorgados !== undefined) {
            await pointsService.recalcularPuntosReferentes();
        }

        return res.status(200).json(plan);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error al actualizar el plan", error });
    }
};


const eliminarPlan = async (req, res) => {
    try {
        const { id_plan } = req.params;

        const plan = await Plan.findByPk(id_plan);

        if (!plan) {
            return res.status(404).json({ mensaje: "Plan no encontrado" });
        }

        await plan.update({
            estado: 'inactivo',
            actualizado_en: new Date()
        });

        return res.status(200).json({ mensaje: "Plan desactivado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error al eliminar el plan", error });
    }
};




export default {
    crearPlan, actualizarPlan, eliminarPlan
};