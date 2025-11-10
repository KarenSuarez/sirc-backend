import { Router } from "express";
import rolController from "../../controllers/api/rol.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Listar todos los roles disponibles
 *     description: Obtiene la lista de todos los roles del sistema
 *     tags: [Roles]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_rol:
 *                     type: integer
 *                     example: 1
 *                   codigo_rol:
 *                     type: string
 *                     example: "ADMIN"
 *                   nombre_rol:
 *                     type: string
 *                     example: "administrador"
 *                   descripcion:
 *                     type: string
 *                     example: "Acceso completo al sistema"
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al listar roles
 */
router.get("/", [authJwt.verifyToken], rolController.listarRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     description: Obtiene información de un rol específico
 *     tags: [Roles]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Información del rol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_rol:
 *                   type: integer
 *                 codigo_rol:
 *                   type: string
 *                 nombre_rol:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *       404:
 *         description: Rol no encontrado
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al obtener rol
 */
router.get("/:id", [authJwt.verifyToken], rolController.obtenerRol);

export default router;