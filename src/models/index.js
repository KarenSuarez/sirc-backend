import { DB, USER, PASSWORD, HOST,PORTDB, dialect as _dialect, pool as _pool } from "../config/db.config.js";
import Sequelize from "sequelize";
import userModel from './user.model.js';
import roleModel from './role.model.js';
import documentTypeModel from './documentType.model.js';
import userRoleModel from './userRole.model.js';
import referenteModel from './referente.model.js';
import planModel from './plan.model.js';
import referedModel from './referido.model.js';
import solicitudRecompensaModel from './solicitudRecompensa.model.js';
import movimientoModel from "./movimiento.model.js";
import historialCategoriaModel from './historialCategoria.model.js';
import historialNivelModel from "./historialNivel.model.js";
import sessionHistoryModel from './sessionHistory.model.js'
import nivelModel from "./nivel.model.js";



const sequelize = new Sequelize(
  DB,
  USER,
  PASSWORD,
  {
    host: HOST,
    port: PORTDB,
    dialect: _dialect,
    dialectOptions: {
      allowPublicKeyRetrieval: true,
      ssl: false
    },
    pool: {
      max: _pool.max,
      min: _pool.min,
      acquire: _pool.acquire,
      idle: _pool.idle
    }
  }
);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


sequelize.authenticate()
  .then(() => {
    console.log("[OK] Conexión a la base de datos establecida correctamente.");
  })
  .catch((err) => {
    console.error("[ERROR] No se pudo conectar a la base de datos:", err);
  });


db.usuario = userModel(sequelize, Sequelize);
db.rol = roleModel(sequelize, Sequelize);
db.tipoDocumento = documentTypeModel(sequelize, Sequelize);
db.rolUsuario = userRoleModel(sequelize, Sequelize);
db.referente = referenteModel(sequelize, Sequelize);
db.plan = planModel(sequelize, Sequelize); 
db.refered = referedModel(sequelize, Sequelize);
db.solicitudRecompensa = solicitudRecompensaModel(sequelize, Sequelize);
db.movimiento = movimientoModel(sequelize, Sequelize);
db.historialCategoria = historialCategoriaModel(sequelize, Sequelize);
db.historialSesion = sessionHistoryModel(sequelize, Sequelize);
db.nivel = nivelModel(sequelize, Sequelize);
db.historialNivel = historialNivelModel(sequelize,Sequelize);


db.tipoDocumento.hasMany(db.usuario, {
  foreignKey: 'id_tipo_documento',
  as: 'tipoDocumentoUsuario'
});
db.usuario.belongsTo(db.tipoDocumento, {
  foreignKey: 'id_tipo_documento'
});

db.tipoDocumento.hasMany(db.refered, {
  foreignKey: 'id_tipo_documento'
});
db.refered.belongsTo(db.tipoDocumento, {
  foreignKey: 'id_tipo_documento'
});


db.usuario.belongsToMany(db.rol, {
  through: db.rolUsuario,
  foreignKey: "numero_documento_identidad",
  otherKey: "id_rol",
  as: "roles"
});
db.rol.belongsToMany(db.usuario, {
  through: db.rolUsuario,
  foreignKey: "id_rol",
  otherKey: "numero_documento_identidad",
  as: "usuarios"
});


db.usuario.hasMany(db.refered, {
  foreignKey: 'documento_referente',
  as: 'referidos'
});

db.refered.belongsTo(db.usuario, {
  foreignKey: 'documento_referente',
  as: 'referente'
});


db.usuario.hasOne(db.referente, {
  foreignKey: 'numero_documento_identidad', 
  as: 'referente'
});
db.referente.belongsTo(db.usuario, {
  foreignKey: 'numero_documento_identidad', 
  as: 'usuario'
});



db.referente.hasMany(db.solicitudRecompensa, {
  foreignKey: "documento_referente",
  sourceKey: "numero_documento_identidad",
  as: "solicitudes"
});

db.solicitudRecompensa.belongsTo(db.referente, {
  foreignKey: "documento_referente",
  targetKey: "numero_documento_identidad",
  as: "referente"
});


db.usuario.hasMany(db.solicitudRecompensa, {
  foreignKey: "numero_documento_identidad",
  as: "solicitudes_procesadas"
});

db.solicitudRecompensa.belongsTo(db.usuario, {
  foreignKey: "numero_documento_identidad",
  as: "procesado_por"
});

db.referente.hasMany(db.movimiento, {
  foreignKey: "numero_documento_identidad",
  sourceKey: "numero_documento_identidad",
  as: "historial_recompensas"
});

db.movimiento.belongsTo(db.referente, {
  foreignKey: "numero_documento_identidad",
  targetKey: "numero_documento_identidad",
  as: "referente"
});

db.referente.hasMany(db.historialCategoria, {
  foreignKey: "id_referente",
  as: "historialCategorias"
});

db.historialCategoria.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente"
});


db.ROLES = ["administrador", "referente", "asesor ventas", "gerente ventas", "contador"];
db.historialSesion.belongsTo(db.usuario, {
  foreignKey: "usuario_id",
});
db.usuario.hasMany(db.historialSesion, {
  foreignKey: "usuario_id",
});

db.historialNivel.belongsTo(db.nivel, {
  foreignKey: 'nivel_anterior',
  targetKey: 'id_nivel',
  as: 'nivelAnterior'
});

db.historialNivel.belongsTo(db.nivel, {
  foreignKey: 'nivel_nuevo',
  targetKey: 'id_nivel',
  as: 'nivelNuevo' 
});


db.nivel.hasMany(db.historialNivel, {
  foreignKey: 'nivel_anterior',
  sourceKey: 'id_nivel',
  as: 'historialComoAnterior'
});

db.nivel.hasMany(db.historialNivel, {
  foreignKey: 'nivel_nuevo',
  sourceKey: 'id_nivel',
  as: 'historialComoNuevo'
});



export default db;