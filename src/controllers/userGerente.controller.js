import userGerenteService from "../services/userGerente.service.js";

/**
 * @swagger
 * /user/gerente/boardAllStats:
 *   get:
 *     summary: Obtiene estadísticas para el gerente de ventas
 *     description: Proporciona estadísticas clave como el número de referentes activos, total de referidos, planes activos y comisiones pagadas.
 *     tags:
 *       - Gerente de Ventas
 *     responses:
 *       200:
 *         description: Estadísticas del gerente de ventas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contenido solo para Gerentes de Ventas.
 *                 referentesActivos:
 *                   type: integer
 *                   description: Número de referentes activos.
 *                 totalReferidos:
 *                   type: integer
 *                   description: Total de referidos.
 *                 planesActivos:
 *                   type: integer
 *                   description: Número de planes activos.
 *                 comisionesPagadas:
 *                   type: number
 *                   description: Total de comisiones pagadas.
 *       500:
 *         description: Error interno del servidor.
 */
const gerenteBoardAllStats = async (req, res) => {
  const data = await userGerenteService.getInfo();
  try {
    return res.status(200).send({
      message: " Contenido solo para Gerentes de Ventas.",
      referentesActivos: data.referentesActivos,
      totalReferidos: data.totalReferidos,
      planesActivos: data.planesActivos,
      comisionesPagadas: data.comisionesPagadas,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
/**
 * @swagger
 * /user/gerente/analisisVentas:
 *   get:
 *     summary: Obtiene análisis de ventas para el gerente de ventas
 *     description: Proporciona análisis detallados como el total de referidos por mes y por estado.
 *     tags:
 *       - Gerente de Ventas
 *     responses:
 *       200:
 *         description: Análisis de ventas del gerente de ventas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statsReferidosPorMes:
 *                   type: array
 *                   description: Total de referidos agrupados por mes.
 *                   items:
 *                     type: object
 *                     properties:
 *                       mes:
 *                         type: string
 *                         format: date-time
 *                         description: Mes del año.
 *                       total_referidos:
 *                         type: integer
 *                         description: Total de referidos en ese mes.
 *                 statsReferidosPorEstado:
 *                   type: array
 *                   description: Total de referidos agrupados por estado.
 *                   items:
 *                     type: object
 *                     properties:
 *                       estado:
 *                         type: string
 *                         description: Estado del referido.
 *                       total_referidos:
 *                         type: integer
 *                         description: Total de referidos en ese estado.
 *                 statsTotalDePlanesAdquiridos:
 *                   type: array
 *                   description: Total de planes adquiridos por referido.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_plan:
 *                         type: integer
 *                         description: ID del plan adquirido.
 *                       total_referidos:
 *                         type: integer
 *                         description: Total de referidos que adquirieron ese plan.
 *                 statsTazaDeConversion:
 *                   type: array
 *                   description: Tasa de conversión de referidos agrupados por mes.
 *                   items:
 *                     type: object
 *                     properties:
 *                       mes:
 *                         type: string
 *                         format: date-time
 *                         description: Mes del año.
 *                       tasa_conversion:
 *                         type: number
 *                         format: float
 *                         description: Tasa de conversión en ese mes.
 *       500:
 *         description: Error interno del servidor.
 */
const getTotalAnaliticas = async (req, res) => {
  try {
    const statsReferidosPorMes = await userGerenteService.getReferidosPorMes();
    const statsReferidosPorEstado = await userGerenteService.getReferidosPorEstado();
    const statsTotalDePlanesAdquiridos = await userGerenteService.getPlanesAdquiridosPorReferido();
    const statsTazaDeConversion = await userGerenteService.getTazaConversionReferidosAgrupadosPorMes();
    return res
      .status(200)
      .send({
        statsReferidosPorMes,
        statsReferidosPorEstado,
        statsTotalDePlanesAdquiridos,
        statsTazaDeConversion
      });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export default {
  gerenteBoardAllStats,
  getTotalAnaliticas,
};
