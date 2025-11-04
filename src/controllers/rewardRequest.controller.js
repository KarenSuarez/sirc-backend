import rewardRequestService from "../services/rewardRequest.service.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudRecompensaRequest:
 *       type: object
 *       required:
 *         - valor_retirar
 *         - tipo_banco
 *         - numero_cuenta
 *       properties:
 *         valor_retirar:
 *           type: number
 *           format: decimal
 *           description: Valor a retirar
 *           example: 100000.50
 *         tipo_banco:
 *           type: string
 *           enum: ["Ahorros", "Corriente", "Nequi", "Daviplata", "Otro"]
 *           description: Tipo de cuenta bancaria
 *           example: "Ahorros"
 *         numero_cuenta:
 *           type: string
 *           maxLength: 30
 *           description: Número de cuenta bancaria
 *           example: "1234567890"
 *     SolicitudRecompensaResponse:
 *       type: object
 *       properties:
 *         id_solicitud:
 *           type: integer
 *           description: ID único de la solicitud
 *         documento_referente:
 *           type: string
 *           description: Documento del referente
 *         valor_retirar:
 *           type: number
 *           format: decimal
 *           description: Valor a retirar
 *         tipo_banco:
 *           type: string
 *           enum: ["Ahorros", "Corriente", "Nequi", "Daviplata", "Otro"]
 *         numero_cuenta:
 *           type: string
 *           description: Número de cuenta bancaria
 *         estado_solicitud:
 *           type: string
 *           enum: ["pendiente", "en_proceso", "completada", "rechazada"]
 *           description: Estado actual de la solicitud
 *         tipo_solicitud:
 *           type: string
 *           enum: ["retiro", "bono_descuento"]
 *           description: Tipo de solicitud
 *         comprobante_pago:
 *           type: string
 *           description: URL o path del comprobante de pago
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *         id_usuario_procesador:
 *           type: string
 *           description: Documento del usuario que procesó la solicitud
 *         fecha_solicitud:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la solicitud
 *         fecha_procesamiento:
 *           type: string
 *           format: date-time
 *           description: Fecha de procesamiento
 *         fecha_actualizacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     ActualizarEstadoRequest:
 *       type: object
 *       required:
 *         - estado_solicitud
 *       properties:
 *         estado_solicitud:
 *           type: string
 *           enum: ["pendiente", "en_proceso", "completada", "rechazada"]
 *           description: Nuevo estado de la solicitud
 *         comprobante_pago:
 *           type: string
 *           description: URL o path del comprobante de pago
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *     RechazarSolicitudRequest:
 *       type: object
 *       required:
 *         - observaciones
 *       properties:
 *         observaciones:
 *           type: string
 *           description: Motivo del rechazo
 *           example: "Datos bancarios incorrectos"
 */

/**
 * @swagger
 * /rewardRequests/solicitar:
 *   post:
 *     summary: Crear una nueva solicitud de recompensa
 *     tags:
 *       - Solicitudes de Recompensa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudRecompensaRequest'
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudRecompensaResponse'
 *       400:
 *         description: Faltan datos obligatorios
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
const crearSolicitud = async (req, res) => {
  try {
    const documento_referente = req.numero_documento_identidad;
    const { valor_retirar, tipo_banco, numero_cuenta } = req.body;

    if (!valor_retirar || !tipo_banco || !numero_cuenta) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const solicitud = await rewardRequestService.crearSolicitud({
      documento_referente,
      valor_retirar,
      tipo_banco,
      numero_cuenta
    });

    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /rewardRequests/:
 *   get:
 *     summary: Obtener todas las solicitudes de recompensa
 *     tags:
 *       - Solicitudes de Recompensa
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SolicitudRecompensaResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - se requiere rol de contador
 *       500:
 *         description: Error del servidor
 */
const obtenerTodasLasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await rewardRequestService.obtenerSolicitudes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /rewardRequests/mis-solicitudes:
 *   get:
 *     summary: Obtener solicitudes del referente autenticado
 *     tags:
 *       - Solicitudes de Recompensa
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes del referente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SolicitudRecompensaResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - se requiere rol de referente
 *       500:
 *         description: Error del servidor
 */
const obtenerSolicitudesReferente = async (req, res) => {
  try {
    const documento_referente = req.numero_documento_identidad;
    const solicitudes = await rewardRequestService.obtenerSolicitudesPorReferente(documento_referente);
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /rewardRequests/{id_solicitud}:
 *   patch:
 *     summary: Actualizar estado de una solicitud
 *     tags:
 *       - Solicitudes de Recompensa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_solicitud
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarEstadoRequest'
 *     responses:
 *       200:
 *         description: Solicitud actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudRecompensaResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - se requiere rol de contador
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error del servidor
 */
const actualizarEstado = async (req, res) => {
  try {
    const { id_solicitud } = req.params;
    const { estado_solicitud, comprobante_pago, observaciones } = req.body;

    const solicitud = await rewardRequestService.actualizarEstado(
      id_solicitud,
      estado_solicitud,
      comprobante_pago,
      observaciones
    );

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /rewardRequests/aprobar/{id_solicitud}:
 *   patch:
 *     summary: Aprobar solicitud y generar comprobante PDF
 *     tags:
 *       - Solicitudes de Recompensa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_solicitud
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud a aprobar
 *     responses:
 *       200:
 *         description: Solicitud aprobada y comprobante generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Archivo PDF de cuenta de cobro
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - se requiere rol de contador
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error del servidor
 */
const aprovarSolicitudYGenerarComprobante = async (req, res) => {
  try {
    console.log("Inicio de aprobación y generación de comprobante");
    const { id_solicitud } = req.params;
    console.log("ID de solicitud recibido:", id_solicitud);

    const solicitud = await rewardRequestService.aprovarSolicitud(id_solicitud);
    console.log("Solicitud obtenida:", solicitud);

    // Generar PDF de cuenta de cobro
    const doc = new PDFDocument();
    const filename = `Cuenta_de_Cobro_Solicitud_${solicitud.id_solicitud}.pdf`;
    const __dirname = path.resolve();
    const tempDir = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) {
      console.log("Directorio temp no existe, creando:", tempDir);
      fs.mkdirSync(tempDir, { recursive: true });
    } else {
      console.log("Directorio temp existe:", tempDir);
    }
    const filepath = path.join(tempDir, filename);
    console.log("Ruta del archivo PDF:", filepath);

    const writeStream = fs.createWriteStream(filepath);
    writeStream.on("error", (err) => {
      console.error("Error en writeStream:", err);
    });

    // Nuevo: manejar evento 'close' del writeStream
    writeStream.on("close", () => {
      console.log("WriteStream cerrado, intentando descargar archivo...");
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
          res.status(500).json({ message: "Error al descargar el archivo" });
        } else {
          console.log("Archivo descargado correctamente, eliminando archivo temporal...");
          fs.unlinkSync(filepath);
        }
      });
    });

    doc.pipe(writeStream);

    // =======================
    // ENCABEZADO
    // =======================
    doc
      .fontSize(20)
      .fillColor("#1E3A8A")
      .text("CUENTA DE COBRO", { align: "center" })
      .moveDown(2);

    // =======================
    // DATOS DE LA SOLICITUD
    // =======================
    const startX = doc.x;
    let startY = doc.y;

    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Número de Solicitud: ${solicitud.id_solicitud}`, startX, startY)
      .moveDown();

    startY = doc.y;
    doc
      .text(`Documento Referente: ${solicitud.documento_referente}`, startX, startY)
      .moveDown();

    startY = doc.y;
    doc
      .text(`Valor a Retirar: $${solicitud.valor_retirar}`, startX, startY)
      .moveDown();

    startY = doc.y;
    doc
      .text(`Tipo de Banco: ${solicitud.tipo_banco}`, startX, startY)
      .moveDown();

    startY = doc.y;
    doc
      .text(`Número de Cuenta: ${solicitud.numero_cuenta}`, startX, startY)
      .moveDown();

    startY = doc.y;
    doc
      .text(`Estado de la Solicitud: ${solicitud.estado_solicitud}`, startX, startY)
      .moveDown();

    doc.end();
    console.log("PDF finalizado, esperando evento close del writeStream...");
    // Ya no usar doc.on("finish")
  } catch (error) {
    console.error("Error en aprovarSolicitudYGenerarComprobante:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /rewardRequests/rechazar/{id_solicitud}:
 *   patch:
 *     summary: Rechazar una solicitud de recompensa
 *     tags:
 *       - Solicitudes de Recompensa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_solicitud
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud a rechazar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RechazarSolicitudRequest'
 *     responses:
 *       200:
 *         description: Solicitud rechazada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudRecompensaResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - se requiere rol de contador
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error del servidor
 */
const rechazarSolicitud = async (req, res) => {
  try {
    const { id_solicitud } = req.params;
    const { observaciones } = req.body;

    const solicitud = await rewardRequestService.rechazarSolicitud(
      id_solicitud,
      observaciones
    );

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
}
export default {
  crearSolicitud,
  obtenerTodasLasSolicitudes,
  obtenerSolicitudesReferente,
  actualizarEstado,
  aprovarSolicitudYGenerarComprobante,
  rechazarSolicitud
};
