// Archivo: initial_data.js

// 1. Exportaciones con Nombre (Named Exports) para las constantes de datos
// Usamos 'export const' para hacer estos arrays disponibles a otros módulos.
export const niveles = [
  {
    id_nivel: 1,
    nombre_nivel: "Bronce",
    porcentaje_beneficio_adicional: 0.0,
    puntos_minimos:20,
    puntos_maximos:0,
    orden: 1,
  },
  {
    id_nivel: 2,
    nombre_nivel: "Plata",
    porcentaje_beneficio_adicional: 5.0,
    puntos_minimos:21,
    puntos_maximos:50,
    orden: 2,
  },
  {
    id_nivel: 3,
    nombre_nivel: "Oro",
    porcentaje_beneficio_adicional: 10.0,
    puntos_minimos:51,
    puntos_maximos:100,
    orden: 3,
  },
  {
    id_nivel: 4,
    nombre_nivel: "Platino",
    porcentaje_beneficio_adicional: 15.0,
    puntos_minimos:101,
    puntos_maximos:200,
    orden: 4,
  },
];

export const roles = [
  { id_rol: 1, nombre_rol: "admin" },
  { id_rol: 2, nombre_rol: "referente" },
  { id_rol: 3, nombre_rol: "gerente" },
  { id_rol: 4, nombre_rol: "asesor" },
  { id_rol: 5, nombre_rol: "contador" }
];

export const tipoDocumento = [
  { id_tipo_documento: 1, nombre: "Cedula de ciudadanía" },
  { id_tipo_documento: 2, nombre: "Pasaporte" },
  { id_tipo_documento: 3, nombre: "Cedula de Extranjería" },
  { id_tipo_documento: 4, nombre: "RUT" },
];

export const planes = [
  {
    id_plan: "1",
    nombre_plan: "Plan Básico",
    precio_actual: 80000,
    estado: "activo",
    descripcion: "Perfecto para emprendedores y pequeños negocios",
    porcentaje_recompensa: 10,
    puntos_otorgados: 100,
  },
  {
    id_plan: "2",
    nombre_plan: "Plan Profesional",
    precio_actual: 150000,
    estado: "activo",
    descripcion: "Ideal para empresas en crecimiento",
    porcentaje_recompensa: 12,
    puntos_otorgados: 150,
  },
  {
    id_plan: "3",
    nombre_plan: "Plan Empresarial",
    estado: "activo",
    descripcion: "Solución completa para grandes empresas",
    precio_actual: 300000,
    porcentaje_recompensa: 15,
    puntos_otorgados: 200,
  },
];

// Funciones internas para insertar la data (No necesitan ser exportadas)
const initialNiveles = (db) => db.nivel.bulkCreate(niveles);
const initialTipoDocumentos = (db) => db.tipoDocumento.bulkCreate(tipoDocumento);
const initialRoles = (db) => db.rol.bulkCreate(roles);
const initialPlanes = (db) => db.plan.bulkCreate(planes);

const red = "\x1b[31m";
const green = "\x1b[32m";
/**
 * Verifica si las colecciones están vacías e inserta la data inicial si es
 * necesario.
 *
 * @param {object} db - Instancia de la base de datos (por ejemplo, Sequelize o
 *   Mongoose).
 * @param {number} countDocs - Conteo de documentos de tipoDocumento.
 * @param {number} countRoles - Conteo de roles.
 * @param {number} countNiveles - Conteo de niveles.
 * @param {number} countPlan - Conteo de planes.
 */
async function checkInitialCounts(
  db,
  countDocs,
  countRoles,
  countNiveles,
  countPlan,
) {
  if (countDocs === 0) {
    console.log("LOADING Insertando tipos de documento iniciales...");
    await initialTipoDocumentos(db); // Llamada directa a la función interna
  } else {
    console.log(
      green + "OK. Tipos de documento ya existen, no se insertan nuevamente.",
    );
  }
  if (countRoles === 0) {
    console.log("...LOADING Insertando roles iniciales...");
    await initialRoles(db); // Llamada directa a la función interna
  } else {
    console.log(green + "OK. Roles ya existen, no se insertan nuevamente.");
  }
  if (countNiveles === 0) {
    console.log("DONE Insertando niveles iniciales...");
    await initialNiveles(db); // Llamada directa a la función interna
  } else {
    console.log(
      green + "OK. Categorías ya inicializadas, no se insertan nuevamente.",
    );
  }
  if (countPlan === 0) {
    console.log("DONE Insertando planes iniciales...");
    await initialPlanes(db); // Llamada directa a la función interna
  } else {
    console.log(
      green + "OK. Planes ya inicializados, no se insertan nuevamente.",
    );
  }
}

/**
 * Función principal para la inicialización de la data.
 *
 * @param {object} db - Instancia de la base de datos.
 */
const initializeData = async (db) => {
  try {
    // Es mejor llamar a las funciones de conteo una por una o usar Promise.all
    // si son llamadas a la base de datos que pueden ejecutarse en paralelo.
    const countDocs = await db.tipoDocumento.count();
    const countRoles = await db.rol.count();
    const countNiveles = await db.nivel.count();
    const countPlan = await db.plan.count();

    await checkInitialCounts(
      db,
      countDocs,
      countRoles,
      countNiveles,
      countPlan,
    );
    console.log("--- Inicialización de data completa ---" );
  } catch (error) {
    // Lanza el error para que pueda ser manejado por quien llama a initializeData
    throw new Error(`Error al inicializar la data: ${error.message}`);
  }
};

// 2. Exportación por Defecto (Default Export)
// Solo se usa una vez, para la función principal del módulo.
export default initializeData;
