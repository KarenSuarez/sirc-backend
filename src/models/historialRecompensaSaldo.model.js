export default (sequelize, Sequelize) => {
  const HisRecompensaSaldo = sequelize.define(
    "his_recompensa_saldo",
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
      porcent_plan_recomp_sald: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0
      },
      creado_en:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      id_movimiento: {
        type: Sequelize.INTEGER,
        allowNull:true,
        reference:{
          model:"Movimiento",
          key:"id_movimiento"
        }
      },
      tipo_cambio:{
        type:Sequelize.ENUM("REC", "VEN"), //REC->recompensa, RET-> retiro
        defaultValue: "REC", 
        allowNull:false
      },
      id_asesor_valid: {
        type: Sequelize.STRING(20),
        allowNull: false,
        referece:{
          model:"Usuario",
          key:"numero_documento_identidad"
        }
      }
    }
  );

  return HisRecompensaSaldo;
}