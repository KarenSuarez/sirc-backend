import {
  DB,
  USER,
  PASSWORD,
  HOST,
  PORTDB,
  dialect as _dialect,
  pool as _pool,
} from "../config/db.config.js";
import Sequelize from "sequelize";
import usuarioModel from "./usuario.model.js";
import rolModel from "./rol.model.js";
import documentTypeModel from "./tipoDocumento.model.js";
import userRoleModel from "./rolUsuario.model.js";
import referenteModel from "./referente.model.js";
import planModel from "./plan.model.js";
import referidoModel from "./referido.model.js";
import solicitudRecompensaModel from "./solicitudRecompensa.model.js";
import movimientoReferenciaModel from "./movimientoReferencia.model.js";
import movimientoSaldoModel from "./movimientoSaldo.model.js";
import historialNivelModel from "./historialNivel.model.js";
import historialSesionModel from "./historialSesion.model.js";
import nivelModel from "./nivel.model.js";
import insigniaModel from "./insignia.model.js";
import insigniaReferenteModel from "./insigniaReferente.model.js";
import createLogger from "../utils/logger.js";

const logger = createLogger("models/index.js");

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  port: PORTDB,
  dialect: _dialect,
  dialectOptions: {
    allowPublicKeyRetrieval: true,
    ssl: false,
  },
  pool: {
    max: _pool.max,
    min: _pool.min,
    acquire: _pool.acquire,
    idle: _pool.idle,
  },
  logging: (msg) => logger.debug(msg),
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize
  .authenticate()
  .then(() => {
    logger.info("Conexión a la base de datos establecida correctamente.");
  })
  .catch((err) => {
    logger.error("No se pudo conectar a la base de datos:", err);
  });

db.usuario = usuarioModel(sequelize, Sequelize);
db.rol = rolModel(sequelize, Sequelize);
db.tipoDocumento = documentTypeModel(sequelize, Sequelize);
db.rolUsuario = userRoleModel(sequelize, Sequelize);
db.referente = referenteModel(sequelize, Sequelize);
db.plan = planModel(sequelize, Sequelize);
db.referido = referidoModel(sequelize, Sequelize);
db.solicitudRecompensa = solicitudRecompensaModel(sequelize, Sequelize);
db.movimientoReferencia = movimientoReferenciaModel(sequelize, Sequelize);
db.movimientoSaldo = movimientoSaldoModel(sequelize, Sequelize);
db.historialSesion = historialSesionModel(sequelize, Sequelize);
db.nivel = nivelModel(sequelize, Sequelize);
db.historialNivel = historialNivelModel(sequelize, Sequelize);
db.insignia = insigniaModel(sequelize, Sequelize);
db.insigniaReferente = insigniaReferenteModel(sequelize, Sequelize);

// --- TipoDocumento ---
db.tipoDocumento.hasMany(db.usuario, {
  foreignKey: "id_tipo_documento",
  as: "usuarios",
});
db.usuario.belongsTo(db.tipoDocumento, {
  foreignKey: "id_tipo_documento",
  as: "tipoDocumento",
});

db.tipoDocumento.hasMany(db.referido, {
  foreignKey: "id_tipo_documento",
  as: "referidos",
});
db.referido.belongsTo(db.tipoDocumento, {
  foreignKey: "id_tipo_documento",
  as: "tipoDocumento",
});

// --- Usuario <-> Rol (Many-to-Many) ---
db.usuario.belongsToMany(db.rol, {
  through: db.rolUsuario,
  foreignKey: "id_usuario",
  otherKey: "id_rol",
  as: "roles",
});
db.rol.belongsToMany(db.usuario, {
  through: db.rolUsuario,
  foreignKey: "id_rol",
  otherKey: "id_usuario",
  as: "usuarios",
});

// --- Usuario <-> Referente (One-to-One) ---
db.usuario.hasOne(db.referente, {
  foreignKey: "id_usuario",
  as: "referente",
});
db.referente.belongsTo(db.usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// --- Referente <-> Referido (One-to-Many) ---
db.referente.hasMany(db.referido, {
  foreignKey: "id_referente",
  as: "referidos",
});
db.referido.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente",
});

db.usuario.hasMany(db.referido, {
  foreignKey: "id_asesor_vendedor",
  as: "referidos_convertidos",
});
db.referido.belongsTo(db.usuario, {
  foreignKey: "id_asesor_vendedor",
  as: "asesorVendedor",
});

// --- Plan <-> Referido ---
db.plan.hasMany(db.referido, {
  foreignKey: "id_plan_adquirido",
  as: "referidos",
});
db.referido.belongsTo(db.plan, {
  foreignKey: "id_plan_adquirido",
  as: "plan",
});

// --- Referente <-> SolicitudRecompensa ---
db.referente.hasMany(db.solicitudRecompensa, {
  foreignKey: "id_referente",
  as: "solicitudes",
});
db.solicitudRecompensa.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente",
});

// --- Usuario procesa SolicitudRecompensa ---
db.usuario.hasMany(db.solicitudRecompensa, {
  foreignKey: "id_usuario_procesa",
  as: "solicitudes_procesadas",
});
db.solicitudRecompensa.belongsTo(db.usuario, {
  foreignKey: "id_usuario_procesa",
  as: "procesado_por",
});

// --- Referente <-> MovimientoReferencia ---
db.referente.hasMany(db.movimientoReferencia, {
  foreignKey: "id_referente",
  as: "movimientosReferencia",
});
db.movimientoReferencia.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente",
});

// --- Referido <-> MovimientoReferencia ---
db.referido.hasMany(db.movimientoReferencia, {
  foreignKey: "id_referido",
  as: "movimientosReferencia",
});
db.movimientoReferencia.belongsTo(db.referido, {
  foreignKey: "id_referido",
  as: "referido",
});

// --- Referente <-> MovimientoSaldo ---
db.referente.hasMany(db.movimientoSaldo, {
  foreignKey: "id_referente",
  as: "movimientosSaldo",
});
db.movimientoSaldo.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente",
});

// --- SolicitudRecompensa <-> MovimientoSaldo ---
db.solicitudRecompensa.hasMany(db.movimientoSaldo, {
  foreignKey: "id_solicitud_recompensa",
  as: "movimientosSaldo",
});
db.movimientoSaldo.belongsTo(db.solicitudRecompensa, {
  foreignKey: "id_solicitud_recompensa",
  as: "solicitudRecompensa",
});

// --- MovimientoReferencia <-> MovimientoSaldo ---
db.movimientoReferencia.hasMany(db.movimientoSaldo, {
  foreignKey: "id_movimiento_referencia",
  as: "movimientosSaldo",
});
db.movimientoSaldo.belongsTo(db.movimientoReferencia, {
  foreignKey: "id_movimiento_referencia",
  as: "movimientoReferencia",
});

// --- Usuario crea MovimientoSaldo ---
db.usuario.hasMany(db.movimientoSaldo, {
  foreignKey: "creado_por",
  as: "movimientos_creados",
});
db.movimientoSaldo.belongsTo(db.usuario, {
  foreignKey: "creado_por",
  as: "creador",
});

// --- Usuario <-> HistorialSesion ---
db.usuario.hasMany(db.historialSesion, {
  foreignKey: "id_usuario",
  as: "sesiones",
});
db.historialSesion.belongsTo(db.usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// --- Nivel <-> HistorialNivel ---
db.nivel.hasMany(db.historialNivel, {
  foreignKey: "id_nivel_anterior",
  as: "historialComoAnterior",
});
db.historialNivel.belongsTo(db.nivel, {
  foreignKey: "id_nivel_anterior",
  as: "nivelAnterior",
});

db.nivel.hasMany(db.historialNivel, {
  foreignKey: "id_nivel_nuevo",
  as: "historialComoNuevo",
});
db.historialNivel.belongsTo(db.nivel, {
  foreignKey: "id_nivel_nuevo",
  as: "nivelNuevo",
});

// --- Referente <-> HistorialNivel ---
db.referente.hasMany(db.historialNivel, {
  foreignKey: "id_referente",
  as: "historialNiveles",
});
db.historialNivel.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente",
});

// --- Insignia <-> InsigniaReferente ---
db.insignia.hasMany(db.insigniaReferente, {
  foreignKey: "id_insignia",
  as: "asignaciones",
});
db.insigniaReferente.belongsTo(db.insignia, {
  foreignKey: "id_insignia",
  as: "insignia",
});

// --- Referente <-> InsigniaReferente ---
db.referente.hasMany(db.insigniaReferente, {
  foreignKey: "id_referente",
  as: "insignias",
});
db.insigniaReferente.belongsTo(db.referente, {
  foreignKey: "id_referente",
  as: "referente",
});

// --- Insignia <-> Referente (Many-to-Many) ---
db.insignia.belongsToMany(db.referente, {
  through: db.insigniaReferente,
  foreignKey: "id_insignia",
  otherKey: "id_referente",
  as: "referentes",
});
db.referente.belongsToMany(db.insignia, {
  through: db.insigniaReferente,
  foreignKey: "id_referente",
  otherKey: "id_insignia",
  as: "insigniasObtenidas",
});

db.ROLES = [
  "administrador",
  "referente",
  "asesor_ventas",
  "gerente_ventas",
  "contador",
];

export default db;
