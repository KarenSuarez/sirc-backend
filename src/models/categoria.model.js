export default (sequelize, Sequelize)=>{
    const Categoria_gamificacion = sequelize.define("Categoria_gamificacion",{
        id_categoria:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre_categoria:{
            type: Sequelize.STRING(30),
            allowNull:false
        },
        puntos_maximos:{
            type:Sequelize.INTEGER
        },
        puntos_minimos:{
            type:Sequelize.INTEGER
        },
        beneficio_adicional_perc:{
            type:Sequelize.DECIMAL(10,2)
        },
        descripcion:{
            type:Sequelize.TEXT
        },
        creado_en:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    })
    return Categoria_gamificacion;
}