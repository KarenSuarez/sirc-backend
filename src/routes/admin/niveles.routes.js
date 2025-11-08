import { Router } from "express";
import nivelesController from "../../controllers/admin/niveles.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /niveles:
 *   get:
 *     summary: Listar todos los niveles
 *     description: Obtener lista de niveles de fidelización ordenados por orden_nivel
 *     tags: [Niveles]
 *     responses:
 *       200:
 *         description: Lista de niveles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nivel'
 *       500:
 *         description: Error al listar niveles
 */
router.get("/", nivelesController.listarNiveles);

/**
 * @swagger
 * /niveles/activos:
 *   get:
 *     summary: Listar solo niveles activos
 *     description: Obtener niveles que están actualmente en uso
 *     tags: [Niveles]
 *     responses:
 *       200:
 *         description: Lista de niveles activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nivel'
 *       500:
 *         description: Error al listar niveles activos
 */
router.get("/activos", nivelesController.listarNivelesActivos);

/**
 * @swagger
 * /niveles/{id}:
 *   get:
 *     summary: Obtener un nivel por ID
 *     description: Ver detalles completos de un nivel específico
 *     tags: [Niveles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel
 *     responses:
 *       200:
 *         description: Detalle del nivel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nivel'
 *       404:
 *         description: Nivel no encontrado
 *       500:
 *         description: Error al obtener nivel
 */
router.get("/:id", nivelesController.obtenerNivel);

/**
 * @swagger
 * /niveles:
 *   post:
 *     summary: Crear un nuevo nivel
 *     description: Crear un nivel de fidelización con rangos de puntos y beneficios
 *     tags: [Niveles]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_nivel
 *               - orden_nivel
 *               - puntos_minimos
 *               - puntos_maximos
 *             properties:
 *               nombre_nivel:
 *                 type: string
 *                 example: Platino
 *               orden_nivel:
 *                 type: integer
 *                 example: 5
 *               puntos_minimos:
 *                 type: integer
 *                 example: 1000
 *               puntos_maximos:
 *                 type: integer
 *                 example: 1999
 *               porcentaje_comision_extra:
 *                 type: number
 *                 example: 15
 *               icono_nivel:
 *                 type: string
 *                 example: platinum-medal
 *               color_nivel:
 *                 type: string
 *                 example: "#E5E4E2"
 *               beneficios_nivel:
 *                 type: string
 *                 example: 15% extra + Soporte exclusivo
 *               descripcion:
 *                 type: string
 *                 example: Nivel premium con máximos beneficios
 *     responses:
 *       201:
 *         description: Nivel creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 nivel:
 *                   $ref: '#/components/schemas/Nivel'
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Requiere rol de administrador o gerente de ventas
 *       500:
 *         description: Error al crear nivel
 */
router.post(
  "/",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  nivelesController.crearNivel
);

/**
 * @swagger
 * /niveles/{id}:
 *   put:
 *     summary: Actualizar un nivel existente
 *     description: Modificar parámetros de un nivel de fidelización
 *     tags: [Niveles]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_nivel:
 *                 type: string
 *               puntos_minimos:
 *                 type: integer
 *               puntos_maximos:
 *                 type: integer
 *               porcentaje_comision_extra:
 *                 type: number
 *               icono_nivel:
 *                 type: string
 *               color_nivel:
 *                 type: string
 *               beneficios_nivel:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nivel actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 nivel:
 *                   $ref: '#/components/schemas/Nivel'
 *       404:
 *         description: Nivel no encontrado
 *       500:
 *         description: Error al actualizar nivel
 */
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  nivelesController.actualizarNivel
);

/**
 * @swagger
 * /niveles/{id}:
 *   delete:
 *     summary: Eliminar un nivel
 *     description: Eliminar un nivel de fidelización (solo si no tiene historial asociado)
 *     tags: [Niveles]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nivel eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: No se puede eliminar nivel con historial
 *       404:
 *         description: Nivel no encontrado
 *       500:
 *         description: Error al eliminar nivel
 */
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  nivelesController.eliminarNivel
);

export default router;