/**
 * @swagger
 * 
 */
export default (sequelize, Sequelize) => {
  const HisRecompensaSaldo = sequelize.define(
    "his_recompensa_puntos",
    {
      id_recomp_saldo: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      numero_documento_identidad_referente: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: "Referente",
          key: "numero_documento_identidad",
        },
      },
      id_movimiento: {
        type: Sequelize.INTEGER,
        allowNull:true,
        reference:{
          model:"Movimiento",
          key:"id_movimiento"
        }
      },
      puntos_otorgados: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0
      },
      id_asesor_valid: {
        type: Sequelize.STRING(20),
        allowNull: false,
        referece:{
          model:"Usuario",
          key:"numero_documento_identidad"
        }
      },
      tipo_cambio:{
        type:Sequelize.ENUM("REC", "VEN"), //REC->recompensa, VEN->Vencido/caducado
        defaultValue: "REC", 
        allowNull:false
      },
      creado_en:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }
  );

  return HisRecompensaSaldo;
}