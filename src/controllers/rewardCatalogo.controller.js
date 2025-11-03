import referenteService from "../services/referente.service.js";
import catalogoService from "../services/catalogo.service.js";

/**
 * @swagger
 * /catalogo/listarCatalogo:
 *   get:
 *     summary: lista el catalogo (planes y niveles)
 *     tags:
 *       - Catalogo
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NivelesYPlanesResponse"
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const getCatalogo = async (req, res) => {
  try {
    const niveles = await referenteService.getInformationNivelesTodos();
    const planes = await catalogoService.getTodosLosPlanes();
    //insignias
    if (!niveles) {
      return res.status(404).json({ message: "niveles vacios" });
    }
    res.status(200).send({
      todasLosniveles: niveles,
      todosLosPlanes: planes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /catalogo/nivel:
 *   patch:
 *     summary: Actualiza parcialmente (PATCH) los detalles de un nivel de recompensa.
 *     tags:
 *       - Catalogo
 *     description: Permite a un usuario con rol 'gerente' modificar uno o más campos de un nivel de recompensa existente. id_nivel es el único campo obligatorio para identificar el recurso a actualizar.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Datos a actualizar del nivel. Solo se incluyen los campos a modificar.
 *             properties:
 *               id_nivel:
 *                 type: integer
 *                 format: int32
 *                 description: ID del nivel a actualizar (Obligatorio).
 *                 example: 2
 *               nombre_nivel:
 *                 type: string
 *                 description: Nuevo nombre del nivel.
 *                 example: "Plata Premium"
 *               orden:
 *                 type: integer
 *                 format: int32
 *                 description: Nueva posición de orden del nivel.
 *                 example: 2
 *               puntos_minimos:
 *                 type: integer
 *                 format: int32
 *                 description: Nueva puntuación mínima para el nivel.
 *                 example: 25
 *               porcentaje_beneficio_adicional:
 *                 type: integer
 *                 format: int32
 *                 description: Nuevo porcentaje de beneficio adicional.
 *                 example: 7
 *               puntos_maximos:
 *                 type: integer
 *                 format: int32
 *                 description: Nueva puntuación máxima para el nivel (0 si es ilimitado).
 *                 example: 60
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *                 description: Nueva descripción del nivel.
 *                 example: "Nivel mejorado para usuarios con más puntos."
 *               esta_activa:
 *                 type: boolean
 *                 description: Indica si el nivel debe estar activo (true/false).
 *                 example: true
 *             required:
 *               - id_nivel
 *     responses:
 *       200:
 *         description: Nivel actualizado exitosamente. Retorna el objeto del nivel actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/nivel'
 *             example:
 *               id_nivel: 2
 *               nombre_nivel: "Plata Premium"
 *               porcentaje_beneficio_adicional: 7
 *               descripcion: "Nivel mejorado para usuarios con más puntos."
 *               puntos_minimos: 25
 *               puntos_maximos: 60
 *               orden: 2
 *               activo: true
 *               updateAt: "2025-11-02T15:30:00.000Z"
 *       400:
 *         description: Solicitud inválida. Falta el id_nivel en el cuerpo de la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "id_nivel es requerido"
 *       401:
 *         description: No autorizado (Token inválido o expirado).
 *       403:
 *         description: Prohibido (El usuario no tiene el rol 'gerente').
 *       404:
 *         description: Nivel no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría no encontrada"
 *       500:
 *         description: Error interno del servidor.
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
      esta_activa,
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
      updateAt: new Date(),
    };

    // Elimina campos undefined
    Object.keys(datosNivel).forEach(
      (key) => datosNivel[key] === undefined && delete datosNivel[key],
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
/**
 * @swagger
 * /catalogo/plan:
 *   patch:
 *     summary: Actualiza parcialmente (PATCH) los detalles de un plan.
 *     tags:
 *       - Catalogo
 *     description: Permite a un usuario con rol 'gerente' modificar uno o más campos de un plan existente. id_plan es el único campo obligatorio para identificar el recurso a actualizar.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_plan:
 *                 type: integer
 *                 description: ID del plan a actualizar (Obligatorio).
 *                 example: 1
 *               nombre_plan:
 *                 type: string
 *               precio_actual:
 *                 type: number
 *               porcentaje_recompensa:
 *                 type: number
 *               puntos_otorgados:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *             required:
 *               - id_plan
 *     responses:
 *       200:
 *         description: Plan actualizado exitosamente. Retorna el objeto del plan actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/plan'
 *       400:
 *         description: Solicitud inválida. Falta el id_plan en el cuerpo de la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "id_plan es requerido"
 *       401:
 *         description: No autorizado (Token inválido o expirado).
 *       403:
 *         description: Prohibido (El usuario no tiene el rol 'gerente').
 *       404:
 *         description: Plan no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan no encontrado"
 *       500:
 *         description: Error interno del servidor.
 */
const actualizarPlan = async (req, res) => {
  try {
    const {
      id_plan,
      nombre_plan,
      precio_actual,
      porcentaje_recompensa,
      puntos_otorgados,
      descripcion,
      estado,
    } = req.body;

    if (!id_plan) {
      return res.status(400).json({ message: "id_plan es requerido" });
    }

    // Construir objeto de actualización
    const datosPlan = {
      nombre_plan,
      precio_actual,
      porcentaje_recompensa,
      puntos_otorgados,
      descripcion,
      estado,
      actualizado_en: new Date(),
    };

    // Elimina campos undefined
    Object.keys(datosPlan).forEach(
      (key) => datosPlan[key] === undefined && delete datosPlan[key],
    );

    // Actualizar usando el servicio correspondiente
    const updated = await catalogoService.actualizarPlan(id_plan, datosPlan);

    if (!updated) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.log(req.body);
    res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /catalogo/plan:
 *   put:
 *     summary: Crea un nuevo plan.
 *     tags:
 *       - Catalogo
 *     description: Permite a un usuario con rol 'gerente' crear un nuevo plan en el catálogo.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanInput'
 *     responses:
 *       201:
 *        description: Plan creado exitosamente. Retorna el objeto del plan creado.
 *        content:
 *         application/json:
 *          schema:
 *          $ref: '#/components/schemas/plan'
 *      400:
 *        description: Solicitud inválida.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Datos del plan son requeridos"
 */
const crearPlan = async (req, res) => {
  try {
    const {
      nombre_plan,
      precio_actual,
      porcentaje_recompensa,
      puntos_otorgados,
      descripcion,
      estado,
    } = req.body;

    // Construir objeto de creación
    const datosPlan = {
      nombre_plan,
      precio_actual,
      porcentaje_recompensa,
      puntos_otorgados,
      descripcion,
      estado,
      creado_en: new Date(),
      actualizado_en: new Date(),
    };

    // Crear usando el servicio correspondiente
    const created = await catalogoService.crearPlan(datosPlan);

    res.status(201).json(created);
  } catch (error) {
    console.log(req.body);
    res.status(500).send({ message: error.message });
  }
};
export default {
  getCatalogo,
  actualizarNivel,
  actualizarPlan,
  crearPlan,
};
