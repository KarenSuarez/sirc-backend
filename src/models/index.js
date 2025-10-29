import { DB, USER, PASSWORD, HOST,PORTDB, dialect as _dialect, pool as _pool } from "../config/db.config.js";
import Sequelize from "sequelize";
import userModel from './user.model.js';
import roleModel from './role.model.js';
import documentTypeModel from './documentType.model.js';
import userRoleModel from './userRole.model.js';
import referenteModel from './referente.model.js';
import planModel from './plan.model.js';
import referedModel from './refered.model.js';
import solicitudRecompensaModel from './solicitudRecompensa.model.js';
import movimientoModel from "./movimiento.model.js";
import historialRecompensaModel from './historialRecompensa.model.js';
import historialCategoriaModel from './historialCategoria.model.js';



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

// Probar conexión
sequelize.authenticate()
  .then(() => {
    console.log("✅ Conexión a la base de datos establecida correctamente.");
  })
  .catch(err => {
    console.error("❌ No se pudo conectar a la base de datos:", err);
  });


// Importación de los modelos
db.usuario = userModel(sequelize, Sequelize);
db.rol = roleModel(sequelize, Sequelize);
db.tipoDocumento = documentTypeModel(sequelize, Sequelize);
db.rolUsuario = userRoleModel(sequelize, Sequelize);
db.referente = referenteModel(sequelize, Sequelize);
db.plan = planModel(sequelize, Sequelize); 
db.refered = referedModel(sequelize, Sequelize);
db.solicitudRecompensa = solicitudRecompensaModel(sequelize, Sequelize);
db.movimiento = movimientoModel(sequelize, Sequelize);
db.historialRecompensa = historialRecompensaModel(sequelize, Sequelize);
db.historialCategoria = historialCategoriaModel(sequelize, Sequelize);



// --- Definición de Asociaciones ---

// 1. Usuario <--> Tipo_documento (Uno a Muchos)
db.tipoDocumento.hasMany(db.usuario, {
  foreignKey: 'id_tipo_documento'
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

// 2. Usuario <--> Rol (Muchos a Muchos a través de rol_usuario)
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

// 3. Usuario (referente) <--> Referido (Uno a Muchos)
db.usuario.hasMany(db.refered, {
  foreignKey: 'documento_referente',
  as: 'referidos'
});

db.refered.belongsTo(db.usuario, {
  foreignKey: 'documento_referente',
  as: 'referente'
});

// 4. Usuario <--> Referente (Uno a Uno)
db.usuario.hasOne(db.referente, {
  foreignKey: 'numero_documento_identidad', 
  as: 'referente'
});
db.referente.belongsTo(db.usuario, {
  foreignKey: 'numero_documento_identidad', 
  as: 'usuario'
});


// 5. Solicitud_Recompensa <--> Referente (Muchos a Uno)
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

// 6. Solicitud_Recompensa <--> Usuario (Contador que procesa la solicitud)
db.usuario.hasMany(db.solicitudRecompensa, {
  foreignKey: "numero_documento_identidad",
  as: "solicitudes_procesadas"
});

db.solicitudRecompensa.belongsTo(db.usuario, {
  foreignKey: "numero_documento_identidad",
  as: "procesado_por"
});

// 7. Historial_Recompensa <--> Referente (Muchos a Uno)
db.referente.hasMany(db.historialRecompensa, {
  foreignKey: "numero_documento_identidad",
  sourceKey: "numero_documento_identidad",
  as: "historial_recompensas"
});

db.historialRecompensa.belongsTo(db.referente, {
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

export default db;

