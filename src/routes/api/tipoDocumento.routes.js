import { Router } from "express";
import * as tipoDocumentoController from "../../controllers/api/tipoDocumento.controller.js";

const router = Router();

/**
 * @swagger
 * /tipos-documento:
 *   get:
 *     summary: Obtener tipos de documento disponibles
 *     description: Retorna todos los tipos de documento (CC, NIT, CE, etc.)
 *     tags:
 *       - Tipos de Documento
 *     responses:
 *       200:
 *         description: Lista de tipos de documento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_tipo_documento:
 *                     type: integer
 *                     example: 1
 *                   codigo_tipo:
 *                     type: string
 *                     example: "CC"
 *                   nombre_tipo:
 *                     type: string
 *                     example: "Cédula de Ciudadanía"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", tipoDocumentoController.getTiposDocumento);

export default router;