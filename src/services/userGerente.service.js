import db from '../models/index.js'
const referentes = db.referente;
const refered = db.refered;
const planes = db.plan;
const solicitudRecompensa = db.solicitudRecompensa;


const getInfo = async ()=>{
    try {    
        let referentesActivos = await referentes.count({where: {estado_referente: 'activo'}})?? 0;
        let totalReferidos = await refered.count() ?? 0;
        let planesActivos = await planes.count({where: {estado: 'activo'}})?? 0;
        let comisionesPagadas = await solicitudRecompensa.sum('valor_retirar', {where: {estado_solicitud: 'completada'}}) ?? 0;
        return {referentesActivos, totalReferidos, planesActivos, comisionesPagadas};
    } catch (error) {
        throw new Error("error al obtener las estadísticas del gerente");
        
    }
}
const getReferidosPorMes = async ()=>{
    try {
        const resultados = await db.sequelize.query(
            `SELECT 
                EXTRACT(YEAR_MONTH FROM fecha_referencia) AS mes,
                COUNT(*) AS total_referidos
            FROM Referido
            GROUP BY mes
            ORDER BY mes;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );
        return resultados;
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener el total de referidos por mes");
    }
}

const getReferidosPorEstado = async ()=>{
    try {
        const resultados = await db.sequelize.query(
            `SELECT 
                estado_referido,
                COUNT(*) AS total_referidos
            FROM Referido
            GROUP BY estado_referido;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );
        return resultados;
    } catch (error) {
        console.log(error);
        
        throw new Error("Error al obtener el total de referidos por estado");
    }
}

const getReferidosActivosPorPlan = async () => {
    try {
        // Consulta: cantidad de referidos activos agrupados por plan adquirido
        const cantidadPorPlan = await db.sequelize.query(
            `SELECT 
                Referido.id_plan_adquirido AS id_plan,
                Plan.nombre_plan,
                COUNT(*) AS cantidad_referidos
            FROM Referido
            INNER JOIN Plan ON Referido.id_plan_adquirido = Plan.id_plan
            WHERE Referido.estado_referido = 'activo'
              AND Referido.id_plan_adquirido IS NOT NULL
            GROUP BY Referido.id_plan_adquirido, Plan.nombre_plan
            ORDER BY cantidad_referidos DESC;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        // Consulta: obtener el valor de cada plan
        const valoresPlanes = await db.sequelize.query(
            `SELECT 
                id_plan,
                nombre_plan,
                precio_actual
            FROM Plan;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        // Mapear valores de planes por id_plan para fácil acceso
        const valorPorPlan = {};
        valoresPlanes.forEach(plan => {
            valorPorPlan[plan.id_plan] = plan.precio_actual;
        });

        // Calcular el valor total de planes adquiridos por cada plan
        const resultado = cantidadPorPlan.map(item => {
            const valorUnitario = valorPorPlan[item.id_plan] || 0;
            const valorTotal = valorUnitario * item.cantidad_referidos;
            return {
                id_plan: item.id_plan,
                nombre_plan: item.nombre_plan,
                cantidad_referidos: item.cantidad_referidos,
                valor_unitario: valorUnitario,
                valor_total: valorTotal
            };
        });

        return resultado;
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener la cantidad y valor total de planes adquiridos por referidos activos");
    }
}
const getTazaConversionReferidosAgrupadosPorMes = async () => {
    try {
        const resultados = await db.sequelize.query(
            `SELECT 
                EXTRACT(YEAR_MONTH FROM fecha_referencia) AS mes,
                COUNT(*) AS total_referidos,
                SUM(CASE WHEN id_plan_adquirido IS NOT NULL THEN 1 ELSE 0 END) AS total_convertidos,
                (SUM(CASE WHEN id_plan_adquirido IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS tasa_conversion
            FROM Referido
            GROUP BY mes
            ORDER BY mes;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );
        return resultados;
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener la tasa de conversión de referidos agrupados por mes");
    }
}
export default {
    getInfo, 
    getReferidosPorMes,
    getReferidosPorEstado,
    getReferidosActivosPorPlan,
    getTazaConversionReferidosAgrupadosPorMes
}