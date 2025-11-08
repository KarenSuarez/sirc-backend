import { Router } from "express";
import usuarioController from "../../controllers/admin/usuario.controller.js";
import usuarioAdminController from "../../controllers/admin/usuarioAdmin.controller.js";
import usuarioGerenteController from "../../controllers/admin/usuarioGerente.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Obtener lista de usuarios del sistema (Admin y Gerente)
 *     tags: [Usuarios]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *         description: Filtrar por rol
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       403:
 *         description: Requiere rol de administrador o gerente
 *       500:
 *         description: Error al listar usuarios
 */
router.get(
  "/",
  [authJwt.verifyToken, authJwt.hasRole("administrador", "gerente_ventas")],
  usuarioController.listarUsuarios
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Ver información completa de un usuario específico
 *     tags: [Usuarios]
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
 *         description: Detalle del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener usuario
 */
router.get(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  usuarioController.obtenerUsuario
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Modificar información de un usuario (solo Admin)
 *     tags: [Usuarios]
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
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo_electronico:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar usuario
 */
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  usuarioController.actualizarUsuario
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Desactivar un usuario
 *     description: Desactivar un usuario del sistema (solo Admin)
 *     tags: [Usuarios]
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
 *         description: Usuario desactivado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al desactivar usuario
 */
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  usuarioController.desactivarUsuario
);

/**
 * @swagger
 * /usuarios/admin/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de usuarios (Admin)
 *     description: Distribución de usuarios por rol y actividad reciente
 *     tags: [Usuarios Admin]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 distribucion_roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rol:
 *                         type: string
 *                       cantidad:
 *                         type: integer
 *                 ultimos_registros:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Requiere rol de administrador
 *       500:
 *         description: Error al obtener estadísticas
 */
router.get(
  "/admin/estadisticas",
  [authJwt.verifyToken, authJwt.isAdmin],
  usuarioAdminController.obtenerEstadisticas
);

/**
 * @swagger
 * /usuarios/admin/asignar-rol:
 *   post:
 *     summary: Asignar rol a un usuario (Admin)
 *     description: Asignar o modificar roles de un usuario
 *     tags: [Usuarios Admin]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_rol
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               id_rol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rol asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Usuario ya tiene ese rol
 *       404:
 *         description: Usuario o rol no encontrado
 *       500:
 *         description: Error al asignar rol
 */
router.post(
  "/admin/asignar-rol",
  [authJwt.verifyToken, authJwt.isAdmin],
  usuarioAdminController.asignarRol
);

/**
 * @swagger
 * /usuarios/gerente/equipo:
 *   get:
 *     summary: Obtener equipo de asesores de ventas (Gerente)
 *     description: Lista de asesores de ventas con sus métricas de rendimiento
 *     tags: [Usuarios Gerente]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Equipo de asesores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_asesores:
 *                   type: integer
 *                   example: 5
 *                 equipo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_usuario:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       apellido:
 *                         type: string
 *                       metricas:
 *                         type: object
 *                         properties:
 *                           referidos_convertidos:
 *                             type: integer
 *                           comisiones_generadas:
 *                             type: number
 *       403:
 *         description: Requiere rol de gerente de ventas
 *       500:
 *         description: Error al obtener equipo
 */
router.get(
  "/gerente/equipo",
  [authJwt.verifyToken, authJwt.isGerente],
  usuarioGerenteController.obtenerEquipo
);

/**
 * @swagger
 * /usuarios/gerente/rendimiento:
 *   get:
 *     summary: Obtener rendimiento del equipo de asesores (Gerente)
 *     description: Métricas de rendimiento del equipo de asesores de ventas por período
 *     tags: [Usuarios Gerente]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [semana, mes, trimestre, año]
 *           default: mes
 *         description: Período de análisis
 *     responses:
 *       200:
 *         description: Rendimiento del equipo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 periodo:
 *                   type: string
 *                 fecha_inicio:
 *                   type: string
 *                   format: date-time
 *                 fecha_fin:
 *                   type: string
 *                   format: date-time
 *                 metricas:
 *                   type: object
 *                   properties:
 *                     referidos_convertidos:
 *                       type: integer
 *                     comisiones_generadas:
 *                       type: number
 *                 top_asesores:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Requiere rol de gerente de ventas
 *       500:
 *         description: Error al obtener rendimiento
 */
router.get(
  "/gerente/rendimiento",
  [authJwt.verifyToken, authJwt.isGerente],
  usuarioGerenteController.obtenerRendimiento
);

/**
 * @swagger
 * /usuarios/gerente/estadisticas-detalladas:
 *   get:
 *     summary: Obtener estadísticas detalladas del sistema (Gerente)
 *     description: Distribución de referentes por nivel, referidos por estado y comisiones por estado
 *     tags: [Usuarios Gerente]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas detalladas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referentes_por_nivel:
 *                   type: array
 *                 referidos_por_estado:
 *                   type: array
 *                 comisiones_por_estado:
 *                   type: array
 *       403:
 *         description: Requiere rol de gerente de ventas
 *       500:
 *         description: Error al obtener estadísticas
 */
router.get(
  "/gerente/estadisticas-detalladas",
  [authJwt.verifyToken, authJwt.isGerente],
  usuarioGerenteController.obtenerEstadisticasDetalladas
);

export default router;