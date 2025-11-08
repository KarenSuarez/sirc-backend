import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller.js";
import authJwt from "../../middlewares/authJwt.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema y opcionalmente un perfil de referente
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autenticar usuario con número de documento y contraseña
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida el token actual y registra la hora de logout
 *     tags:
 *       - Auth
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error al cerrar sesión
 */
router.post("/logout", [authJwt.verifyToken], authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     description: Retorna información completa del usuario actual
 *     tags:
 *       - Auth
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autenticado o token inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener información
 */
router.get("/me", [authJwt.verifyToken], authController.getMe);

export default router;