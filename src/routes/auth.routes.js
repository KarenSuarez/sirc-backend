import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authJwt from "../middlewares/authJwt.js";
import { loginLimiter, registerLimiter, logoutLimiter } from "../config/rateLimiter.config.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
  );
  next();
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
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
 *         description: Correo o documento duplicado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/register",
  registerLimiter,
  [authController.checkDuplicateEmailOrDocument],
  authController.register,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout de usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/logout",
  logoutLimiter,
  [authJwt.verifyToken],
  authController.logout,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/login",
  loginLimiter,
  authController.login,
);

/**
 * @swagger
 * /auth/logoutByID:
 *   post:
 *     summary: logout con el id del usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LogoutByIDRequest"
 */
router.post(
  "/logoutbyid",
  logoutLimiter,
  authController.logoutByID,
);

export default router;
