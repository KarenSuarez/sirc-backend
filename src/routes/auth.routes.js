import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authJwt from "../middlewares/authJwt.js";

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
router.post("/logout", [authJwt.verifyToken], authController.logout);

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
router.post("/login", authController.login);

router.post("/logoutbyid", authController.logoutByID);

export default router;
