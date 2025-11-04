import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../models/index.js";

export const generarCuentaCobro = async (solicitud) => {
    try {

        const carpeta = path.join("uploads", "comprobantes");
        if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

        const filename = `cuenta_cobro_${solicitud.id_solicitud}.pdf`;
        const filepath = path.join(carpeta, filename);
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(fs.createWriteStream(filepath));


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

        doc.moveTo(50, 130).lineTo(550, 130).stroke("#1E3A8A").moveDown(1.5);


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


        doc
            .fontSize(12)
            .fillColor("#1E3A8A")
            .text("DETALLES DEL COBRO:", { underline: true })
            .moveDown(0.5);

        const startX = 70;
        const startY = doc.y + 10;

        const tableHeaders = ["Descripción", "Monto", "Estado"];
        const colWidths = [300, 100, 100];


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


        doc
            .font("Helvetica")
            .fillColor("black")
            .rect(startX - 20, startY + 15, 500, 25)
            .stroke("#B0BEC5");

        doc
            .text("Pago de comisión por referido aprobado", startX - 10, startY + 20, { width: colWidths[0] })
            .text(`$${solicitud.valor_retirar.toFixed(2)}`, startX + 300, startY + 20, {
                width: colWidths[1],
                align: "right",
            })
            .text(solicitud.estado_solicitud, startX + 400, startY + 20, {
                width: colWidths[2],
                align: "center",
            });

        doc.moveDown(3);


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


        doc.moveDown(3);

        
        try {
            const contadora = await db.usuario.findOne({
                include: [
                    {
                        model: db.rolUsuario,
                        include: [
                            {
                                model: db.rol,
                                where: { nombre_rol: "Contadora" },
                            },
                        ],
                    },
                ],
                attributes: ["nombre", "apellido", "correo_electronico"],
            });

            if (contadora) {
                const firmaPath = path.resolve("public/images/firma_contadora.png");
                if (fs.existsSync(firmaPath)) {
                    doc.image(firmaPath, 220, doc.y, { width: 150 });
                    doc.moveDown(2);
                }

                doc
                    .fontSize(12)
                    .fillColor("black")
                    .text(`${contadora.nombre} ${contadora.apellido}`, { align: "center" })
                    .text("Contadora Pública - CLARISA CLOUD S.A.S", { align: "center" });
            } else {
                doc
                    .fontSize(12)
                    .fillColor("black")
                    .text("Contadora no registrada", { align: "center" });
            }
        } catch (err) {
            console.error("Error obteniendo la contadora:", err);
        }

        doc.moveDown(2);
        doc
            .fontSize(10)
            .fillColor("gray")
            .text("Gracias por ser parte de Clarisa Cloud.", { align: "center" });

        doc.end();


        await new Promise((resolve) => doc.on("finish", resolve));

        return filepath;
    } catch (error) {
        console.error("Error generando cuenta de cobro:", error);
        throw error;
    }
};
