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




export default {
  getCatalogo,
};
