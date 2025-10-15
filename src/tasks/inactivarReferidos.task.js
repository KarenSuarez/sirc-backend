import cron from "node-cron";
import db from "../models/index.js";
import { Op } from "sequelize";

const Referido = db.refered;

// Ejecuta la tarea cada día a medianoche
cron.schedule("0 0 * * *", async () => {
  console.log(" Revisando referidos 'contactado' con más de 10 días sin activar...");

  const diezDiasAtras = new Date();
  diezDiasAtras.setDate(diezDiasAtras.getDate() - 10);

  try {
    const [updated] = await Referido.update(
      { estado_referido: "inactivo" },
      {
        where: {
          estado_referido: "contactado",
          fecha_primer_contacto: { [Op.lt]: diezDiasAtras },
        },
      }
    );

    if (updated > 0) {
      console.log(` ${updated} referidos pasaron a estado 'inactivo'.`);
    } else {
      console.log("No hay referidos para actualizar.");
    }
  } catch (error) {
    console.error(" Error al actualizar referidos:", error.message);
  }
});
