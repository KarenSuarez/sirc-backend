import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../models/index.js";

export const generarCuentaCobro = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la solicitud
    const solicitud = await db.solicitudRecompensa.findByPk(id, {
      include: [
        {
          model: db.refered,
          include: [
            {
              model: db.usuario,
              attributes: ["nombre", "apellido", "correo_electronico"],
            },
          ],
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // Crear carpeta de destino
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

    const filename = `cuenta_cobro_${solicitud.id_solicitud}.pdf`;
    const filepath = path.join("uploads", filename);
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filepath));

    // =======================
    // ENCABEZADO
    // =======================
    const logoPath = path.resolve("public/images/logo_clarisa.png"); 
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 80 });
    }
    doc
      .fontSize(18)
      .fillColor("#1E3A8A")
      .text("CLARISA CLOUD S.A.S", 150, 50)
      .fontSize(12)
      .fillColor("gray")
      .text("clarisacloud.com", 150, 85);

    doc.moveDown(2);
    doc
      .fontSize(16)
      .fillColor("#1E3A8A")
      .text("CUENTA DE COBRO", { align: "center" })
      .moveDown();

    // Línea decorativa
    doc.moveTo(50, 130).lineTo(550, 130).stroke("#1E3A8A").moveDown(1.5);

    // =======================
    // DATOS PRINCIPALES
    // =======================
    const ref = solicitud.Referente?.Usuario || {};
    const fecha = new Date(solicitud.fecha_solicitud).toLocaleDateString("es-CO");

    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Número de Cuenta de Cobro: ${solicitud.id_solicitud}`)
      .text(`Fecha de Emisión: ${fecha}`)
      .moveDown(1);

    doc
      .fontSize(12)
      .fillColor("#1E3A8A")
      .text("DATOS DEL REFERENTE:", { underline: true })
      .moveDown(0.5);

    doc
      .fillColor("black")
      .text(`Nombre: ${ref.nombre || ""} ${ref.apellido || ""}`)
      .text(`Correo: ${ref.correo_electronico || ""}`)
      .moveDown(1);

    // =======================
    // DETALLES DEL COBRO
    // =======================
    doc
      .fontSize(12)
      .fillColor("#1E3A8A")
      .text("DETALLES DEL COBRO:", { underline: true })
      .moveDown(0.5);

    const startX = 70;
    const startY = doc.y + 10;

    const tableHeaders = ["Descripción", "Monto", "Estado"];
    const colWidths = [300, 100, 100];

    // Dibujar encabezados
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("white")
      .rect(startX - 20, startY - 5, 500, 20)
      .fill("#1E3A8A");

    doc
      .fillColor("white")
      .text(tableHeaders[0], startX - 10, startY - 2, { width: colWidths[0] })
      .text(tableHeaders[1], startX + 300, startY - 2, { width: colWidths[1], align: "right" })
      .text(tableHeaders[2], startX + 400, startY - 2, { width: colWidths[2], align: "center" });

    // Contenido
    doc
      .font("Helvetica")
      .fillColor("black")
      .rect(startX - 20, startY + 15, 500, 25)
      .stroke("#B0BEC5");

    doc
      .text("Pago de comisión por referido aprobado", startX - 10, startY + 20, { width: colWidths[0] })
      .text(`$${solicitud.monto_solicitado.toFixed(2)}`, startX + 300, startY + 20, {
        width: colWidths[1],
        align: "right",
      })
      .text(solicitud.estado_solicitud, startX + 400, startY + 20, {
        width: colWidths[2],
        align: "center",
      });

    doc.moveDown(3);

    // =======================
    // OBSERVACIONES
    // =======================
    doc
      .fontSize(12)
      .fillColor("#1E3A8A")
      .text("OBSERVACIONES:", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor("black")
      .text(solicitud.observaciones || "Ninguna observación.")
      .moveDown(3);

    // =======================
    // PIE DE FIRMA
    // =======================
    doc.moveDown(3);
    doc
      .fontSize(12)
      .fillColor("black")
      .text("__________________________________", { align: "center" })
      .text(`${ref.nombre || ""} ${ref.apellido || ""}`, { align: "center" })
      .text("Referente", { align: "center" })
      .moveDown(2)
      .fontSize(10)
      .fillColor("gray")
      .text("Gracias por ser parte de Clarisa Cloud.", { align: "center" });

    doc.end();

    // Enviar al navegador
    doc.on("finish", () => {
      res.download(filepath, filename);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generando cuenta de cobro", error: error.message });
  }
};
