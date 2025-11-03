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
export default {
    getInfo, 
    getReferidosPorMes,
    getReferidosPorEstado
}