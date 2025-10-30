import catalogoService from "../services/catalogo.service";

const getCatalogoPuntosPorCategoria = async (req, res) => {
    try {
        const { nombreCategoria } = req.params;
        const categoria = await catalogoService.getCatalogoPuntosPorCategoria(nombreCategoria);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getCatalogoPuntosPorCategoria
};