import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generarCuentaCobro = async (solicitud) => {
  try {


    const carpeta = path.join("uploads", "comprobantes");
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

    const filename = `cuenta_cobro_${solicitud.id_solicitud}.pdf`;
    const filepath = path.join(carpeta, filename);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filepath));

    const logoPath = path.join(process.cwd(), "public", "images", "logo_clarisa.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 80 });
    }

    doc
      .fontSize(18)
      .fillColor("#1E3A8A")
      .text("CLARISA CLOUD S.A.S", 150, 50, { width: 400, continued: false })
      .fontSize(11)
      .fillColor("gray")
      .text("https://clarisa.co", 150, 75, { width: 400, continued: false });


    doc.y = 140;


    doc
      .fontSize(16)
      .fillColor("#1E3A8A")
      .text("COMPROBANTE DE PAGO", 50, doc.y, { 
        align: "center", 
        width: 500,
        continued: false 
      });
    
    doc.moveDown(1);


    const lineY = doc.y;
    doc.moveTo(50, lineY).lineTo(550, lineY).stroke("#1E3A8A");
    doc.moveDown(1.5);


    const ref = solicitud.referente?.usuario || {};
    const fecha = new Date(solicitud.fecha_solicitud).toLocaleDateString("es-CO");

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Número de Cuenta de Cobro: ${solicitud.id_solicitud}`, 50, doc.y, { continued: false })
      .text(`Fecha de Emisión: ${fecha}`, 50, doc.y, { continued: false });
    
    doc.moveDown(1.5);


    doc
      .fontSize(12)
      .fillColor("#1E3A8A")
      .text("DATOS DEL REFERENTE", 50, doc.y, { underline: true, continued: false });
    
    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Nombre: ${ref.nombre || "N/A"} ${ref.apellido || ""}`, 50, doc.y, { continued: false })
      .text(`Correo: ${ref.correo_electronico || "N/A"}`, 50, doc.y, { continued: false })
      .text(`Documento: ${solicitud.referente?.numero_documento_identidad || "N/A"}`, 50, doc.y, { continued: false });
    
    doc.moveDown(1.5);


    doc
      .fontSize(12)
      .fillColor("#1E3A8A")
      .text("DETALLES DEL COBRO", 50, doc.y, { underline: true, continued: false });
    
    doc.moveDown(1);

  
    const startX = 50;
    const startY = doc.y;
    const tableWidth = 500;
    const rowHeight = 25;

    doc.font("Helvetica-Bold").fontSize(11).fillColor("white");
    doc.rect(startX, startY, tableWidth, rowHeight).fill("#1E3A8A");

    doc
      .fillColor("white")
      .text("Descripción", startX + 10, startY + 7, { 
        width: 280, 
        continued: false 
      });
    
    doc.text("Monto", startX + 300, startY + 7, { 
      width: 100, 
      align: "right",
      continued: false 
    });
    
    doc.text("Estado", startX + 410, startY + 7, { 
      width: 80, 
      align: "center",
      continued: false 
    });


    doc.font("Helvetica").fillColor("black");
    const dataY = startY + rowHeight;
    doc.rect(startX, dataY, tableWidth, rowHeight).stroke("#B0BEC5");

    doc.text("Pago de comisión por referido aprobado", startX + 10, dataY + 7, {
      width: 280,
      continued: false
    });

    doc.text(
      `$${solicitud.valor_retirar?.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "0.00"}`,
      startX + 300,
      dataY + 7,
      { width: 100, align: "right", continued: false }
    );

    doc.text(solicitud.estado_solicitud || "N/A", startX + 410, dataY + 7, {
      width: 80,
      align: "center",
      continued: false
    });


    doc.y = dataY + rowHeight + 20;


    doc
      .fontSize(12)
      .fillColor("#1E3A8A")
      .text("OBSERVACIONES", 50, doc.y, { underline: true, continued: false });
    
    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor("black")
      .text(solicitud.observaciones || "Ninguna observación.", 50, doc.y, { 
        width: 500,
        continued: false 
      });
    
    doc.moveDown(3);


    const contadora = solicitud.procesado_por || {};

    const firmaPath = path.join(process.cwd(), "public", "images", "firma_contadora.png");
    if (fs.existsSync(firmaPath)) {
      const firmaY = doc.y + 10;
      doc.image(firmaPath, 225, firmaY, { width: 150 });
      doc.y = firmaY + 80;
    } else {
      doc.moveDown(3);
    }

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`${contadora.nombre || "Contadora"} ${contadora.apellido || ""}`, 50, doc.y, {
        align: "center",
        width: 500,
        continued: false
      });

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`CC: ${contadora.numero_documento_identidad || "N/A"}`, 50, doc.y, {
        align: "center",
        width: 500,
        continued: false
      });

    doc.text("Contadora Pública - CLARISA CLOUD S.A.S", 50, doc.y, {
      align: "center",
      width: 500,
      continued: false
    });


    doc.moveDown(2);
    doc
      .fontSize(9)
      .fillColor("gray")
      .text("Gracias por ser parte de Clarisa Cloud.", 50, doc.y, {
        align: "center",
        width: 500,
        continued: false
      });

    doc.end();
    await new Promise((resolve) => doc.on("finish", resolve));

   
    return filepath;
  } catch (error) {
    co
    throw error;
  }
};