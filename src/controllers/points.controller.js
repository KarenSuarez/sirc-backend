import pointsService from "../services/points.service.js";

/**
 * @swagger
 * /points/referente:
 *   get:
 *     summary: Consulta los puntos acumulados de un referente
 *     tags:
 *       - Points
 *     description: Permite obtener los puntos acumulados de un referente dado su número de documento de identidad.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numero_documento_identidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de documento de identidad del referente.
 *         example: "12345678"
 *     responses:
 *       200:
 *         description: Consulta exitosa. Retorna los puntos acumulados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consulta exitosa"
 *                 data:
 *                   type: object
 *                   properties:
 *                     puntos_acumulados:
 *                       type: integer
 *                       example: 150
 *       404:
 *         description: Referente no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El referente no existe"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al consultar los puntos"
 */


const consultarPuntos = async (req, res) => {
  try {
    const numero_documento_identidad = req.numero_documento_identidad;
    const data = await pointsService.consultarPuntosReferente(numero_documento_identidad);

    res.status(200).json({
      message: "Consulta exitosa",
      data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  consultarPuntos
};
