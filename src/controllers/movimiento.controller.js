import db from "../models/index.js";
const Movimiento = db.movimiento;
const Referente = db.referente;

/**
 * @swagger
 * /historial/movimientos:
 *   post:
 *     summary: Registrar un nuevo movimiento
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_movimiento:
 *                 type: string
 *                 enum: [NA, PE, RE]
 *                 example: NA
 *               cantidad_puntos:
 *                 type: integer
 *                 example: 100
 *               monto:
 *                 type: number
 *                 format: float
 *                 example: 50000
 *               numero_documento_identidad:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       201:
 *         description: Movimiento registrado correctamente
 */
export const registrarMovimiento = async (req, res) => {
  try {
    const { tipo_movimiento, cantidad_puntos, monto, numero_documento_identidad } = req.body;

    const referente = await Referente.findOne({
      where: { numero_documento_identidad },
    });

    if (!referente) {
      return res.status(404).json({ message: "Referente no encontrado" });
    }

    const nuevoMovimiento = await Movimiento.create({
      tipo_movimiento,
      cantidad_puntos,
      monto,
      numero_documento_identidad,
    });

    res.status(201).json({
      message: " Movimiento registrado correctamente",
      data: nuevoMovimiento,
    });
  } catch (error) {
    console.error(" Error al registrar movimiento:", error);
    res.status(500).json({
      message: "Error al registrar movimiento",
      error: error.message,
    });
  }
};
