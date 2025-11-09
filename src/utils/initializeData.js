import createLogger from "./logger.js";

const logger = createLogger("initializeData.js");

const initializeData = async (db) => {
  logger.info("Iniciando la verificación de datos maestros...");

  try {
    // --- Tipos de Documento ---
    const tipoDocumentoCount = await db.tipoDocumento.count();

    if (tipoDocumentoCount === 0) {
      await db.tipoDocumento.bulkCreate([
        {
          codigo_tipo: "CC",
          nombre_tipo: "Cédula de Ciudadanía",
        },
        {
          codigo_tipo: "NIT",
          nombre_tipo: "Número de Identificación Tributaria",
        },
        {
          codigo_tipo: "CE",
          nombre_tipo: "Cédula de Extranjería",
        },
        {
          codigo_tipo: "COD",
          nombre_tipo: "Código de Empleado",
        },
      ]);
      logger.info("Tipos de documento cargados (4)");
    } else {
      logger.info("Tipos de documento ya existen");
    }

    // --- Roles ---
    const rolesCount = await db.rol.count();

    if (rolesCount === 0) {
      await db.rol.bulkCreate([
        {
          codigo_rol: "ADMIN",
          nombre_rol: "administrador",
          descripcion: "Administrador del sistema con acceso completo",
        },
        {
          codigo_rol: "REF",
          nombre_rol: "referente",
          descripcion: "Usuario referente que genera referencias",
        },
        {
          codigo_rol: "ASESOR",
          nombre_rol: "asesor_ventas",
          descripcion: "Asesor de ventas que gestiona referidos",
        },
        {
          codigo_rol: "GERENTE",
          nombre_rol: "gerente_ventas",
          descripcion: "Gerente de ventas con permisos de supervisión",
        },
        {
          codigo_rol: "CONTADOR",
          nombre_rol: "contador",
          descripcion: "Contador con acceso a información financiera",
        },
      ]);
      logger.info("Roles cargados (5)");
    } else {
      logger.info("Roles ya existen");
    }

    // --- Niveles ---
    const nivelesCount = await db.nivel.count();

    if (nivelesCount === 0) {
      await db.nivel.bulkCreate([
        {
          nombre_nivel: "Bronce",
          orden_nivel: 1,
          puntos_minimos: 0,
          puntos_maximos: 99,
          porcentaje_comision_extra: 0.0,
          icono_nivel: "bronze-medal",
          color_nivel: "#D4785B",
          beneficios_nivel: "Nivel inicial - Sin beneficios adicionales",
          descripcion: "Nivel básico para nuevos referentes",
        },
        {
          nombre_nivel: "Plata",
          orden_nivel: 2,
          puntos_minimos: 100,
          puntos_maximos: 299,
          porcentaje_comision_extra: 2.5,
          icono_nivel: "silver-medal",
          color_nivel: "#A8B8C8",
          beneficios_nivel: "2.5% adicional en comisiones",
          descripcion: "Nivel intermedio con bonificación extra",
        },
        {
          nombre_nivel: "Oro",
          orden_nivel: 3,
          puntos_minimos: 300,
          puntos_maximos: 599,
          porcentaje_comision_extra: 5.0,
          icono_nivel: "gold-medal",
          color_nivel: "#F4B942",
          beneficios_nivel: "5% adicional en comisiones + Soporte prioritario",
          descripcion: "Nivel avanzado con múltiples beneficios",
        },
        {
          nombre_nivel: "Platino",
          orden_nivel: 4,
          puntos_minimos: 600,
          puntos_maximos: 899,
          porcentaje_comision_extra: 7.5,
          icono_nivel: "platinum-medal",
          color_nivel: "#B8A9C9",
          beneficios_nivel: "7.5% adicional en comisiones + Soporte VIP",
          descripcion:
            "Nivel premium con beneficios avanzados y soporte personalizado",
        },
        {
          nombre_nivel: "Diamante",
          orden_nivel: 5,
          puntos_minimos: 900,
          puntos_maximos: 999999,
          porcentaje_comision_extra: 10.0,
          icono_nivel: "diamond",
          color_nivel: "#4ECDE6",
          beneficios_nivel:
            "10% adicional en comisiones + Soporte VIP + Acceso exclusivo",
          descripcion:
            "Nivel élite con máximos beneficios y reconocimiento especial",
        },
      ]);
      logger.info("Niveles cargados (4)");
    } else {
      logger.info("Niveles ya existen");
    }

    // --- Planes ---
    const planesCount = await db.plan.count();

    if (planesCount === 0) {
      await db.plan.bulkCreate([
        {
          nombre_plan: "Plan Basic",
          descripcion: "Plan ideal para pequeñas empresas",
          precio_actual: 290000.0,
          porcentaje_comision_base: 10.0,
          puntos_otorgados: 50,
          estado_plan: "activo",
          icono_plan: "package-basic",
          color_plan: "#4A90E2",
        },
        {
          nombre_plan: "Plan Pro",
          descripcion: "Plan completo para empresas en crecimiento",
          precio_actual: 490000.0,
          porcentaje_comision_base: 15.0,
          puntos_otorgados: 100,
          estado_plan: "activo",
          icono_plan: "package-premium",
          color_plan: "#F5A623",
        },
        {
          nombre_plan: "Plan Plus",
          descripcion: "Plan avanzado para grandes empresas",
          precio_actual: 880000.0,
          porcentaje_comision_base: 20.0,
          puntos_otorgados: 200,
          estado_plan: "activo",
          icono_plan: "package-enterprise",
          color_plan: "#7B68EE",
        },
        {
          nombre_plan: "Plan Empresarial",
          descripcion: "Plan avanzado para grandes empresas",
          precio_actual: 1500000.0,
          porcentaje_comision_base: 20.0,
          puntos_otorgados: 200,
          estado_plan: "activo",
          icono_plan: "package-enterprise",
          color_plan: "#7B68EE",
        },
      ]);
      logger.info("Planes cargados (4)");
    } else {
      logger.info("Planes ya existen");
    }

    // --- Insignias ---
    const insigniasCount = await db.insignia.count();

    if (insigniasCount === 0) {
      await db.insignia.bulkCreate([
        {
          nombre_insignia: "Primera Venta",
          descripcion:
            "¡Felicitaciones! Realizaste tu primera conversión exitosa",
          icono_insignia: "gift", // símbolo de recompensa inicial
          color_insignia: "#FFD700",
          criterio_obtencion: "Convertir 1 referido",
          rareza: "comun",
          estado: "activa",
        },
        {
          nombre_insignia: "Vendedor Estrella",
          descripcion: "Has convertido 10 referidos exitosamente",
          icono_insignia: "star", // estrella por rendimiento destacado
          color_insignia: "#FFA500",
          criterio_obtencion: "Convertir 10 referidos",
          rareza: "rara",
          estado: "activa",
        },
        {
          nombre_insignia: "Maestro de Referencias",
          descripcion: "Has convertido 50 referidos. ¡Eres un experto!",
          icono_insignia: "medal", // medalla por maestría
          color_insignia: "#9370DB",
          criterio_obtencion: "Convertir 50 referidos",
          rareza: "epica",
          estado: "activa",
        },
        {
          nombre_insignia: "Leyenda del Sistema",
          descripcion: "Has convertido 100 referidos. ¡Eres una leyenda!",
          icono_insignia: "crown", // corona por estatus legendario
          color_insignia: "#FF4500",
          criterio_obtencion: "Convertir 100 referidos",
          rareza: "legendaria",
          estado: "activa",
        },
        {
          nombre_insignia: "Nivel Diamante",
          descripcion: "Alcanzaste el nivel más alto de fidelización",
          icono_insignia: "skin", // diamante (skin) por nivel máximo
          color_insignia: "#B9F2FF",
          criterio_obtencion: "Alcanzar nivel Diamante (600+ puntos)",
          rareza: "epica",
          estado: "activa",
        },
        {
          nombre_insignia: "Millonario en Comisiones",
          descripcion: "Has generado más de $1,000,000 en comisiones",
          icono_insignia: "trophy", // trofeo por logro financiero excepcional
          color_insignia: "#32CD32",
          criterio_obtencion: "Generar $1,000,000 en comisiones totales",
          rareza: "legendaria",
          estado: "activa",
        },
      ]);
      logger.info("Insignias cargadas (6)");
    } else {
      logger.info("Insignias ya existen");
    }

    logger.info("Inicialización de datos completada exitosamente");
  } catch (error) {
    // 3. Reemplazamos console.error por logger.error
    logger.error("Error al inicializar datos:", error);
    throw error;
  }
};

export default initializeData;
