import db from '../models/index.js'
const referentes = db.referente;
const refered = db.refered;
const planes = db.plan;
const solicitudRecompensa = db.solicitudRecompensa;


const getInfo = async ()=>{
    try {    
        let referentesActivos = await referentes.count({where: {estado: 'activo'}});
        let totalReferidos = await refered.count();
        let planesActivos = await planes.count({where: {estado: 'activo'}});
        let comisionesPagadas = await solicitudRecompensa.sum('valor_retirar', {where: {estado_solicitud: 'completada'}});
        return {referentesActivos, totalReferidos, planesActivos, comisionesPagadas};
    } catch (error) {
        throw new Error("error al obtener las estadísticas del gerente");
        
    }
}
const getReferidosPorMes = async ()=>{
    try {
        const resultados = await db.sequelize.query(
            `SELECT 
                DATE_TRUNC('month', fecha_referencia) AS mes,
                COUNT(*) AS total_referidos
            FROM Referido
            GROUP BY mes
            ORDER BY mes;`
        );
        return resultados[0];
    } catch (error) {
        throw new Error("Error al obtener el total de referidos por mes");
    }
}
/**
 * "pendiente", "contactado", "activo", "inactivo"
 */
const getReferidosPorEstado = async ()=>{
    try {
        const resultados = await db.sequelize.query(
            `SELECT 
                estado,
                COUNT(*) AS total_referidos
            FROM Referido
            GROUP BY estado;`
        );
        return resultados[0];
    } catch (error) {
        throw new Error("Error al obtener el total de referidos por estado");
    }
}
export default {
    getInfo, 
    getReferidosPorMes,
    getReferidosPorEstado
}