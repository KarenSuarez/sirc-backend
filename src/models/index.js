import { DB, USER, PASSWORD, HOST, dialect as _dialect, pool as _pool } from "../config/db.config.js";
import Sequelize from "sequelize";
import userModel from './user.model.js';
import roleModel from './role.model.js';
import documentTypeModel from './documentType.model.js';
import userRoleModel from './userRole.model.js';

const sequelize = new Sequelize(
  DB,
  USER,
  PASSWORD,
  {
    host: HOST,
    dialect: _dialect,
    operatorsAliases: 0,
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


// Importación de los modelos
db.usuario = userModel(sequelize, Sequelize);
db.rol = roleModel(sequelize, Sequelize);
db.tipoDocumento = documentTypeModel(sequelize, Sequelize);
db.rolUsuario = userRoleModel(sequelize, Sequelize);

// --- Definición de Asociaciones ---

// 1. Usuario <--> Tipo_documento (Uno a Muchos)
db.tipoDocumento.hasMany(db.usuario, {
  foreignKey: 'id_tipo_documento'
});
db.usuario.belongsTo(db.tipoDocumento, {
  foreignKey: 'id_tipo_documento'
});

// 2. Usuario <--> Rol (Muchos a Muchos a través de rol_usuario)
db.usuario.belongsToMany(db.rol, {
  through: db.rolUsuario,
  foreignKey: "id_usuario",
  otherKey: "id_rol"
});
db.rol.belongsToMany(db.usuario, {
  through: db.rolUsuario,
  foreignKey: "id_rol",
  otherKey: "id_usuario"
});

// Exportamos los roles para usarlos fácilmente en la aplicación.
// Esta es la lista actualizada.
db.ROLES = ["administrador", "referente", "asesor ventas", "gerente ventas", "contador"];


// Exportamos el objeto `db` correctamente
db.rol.belongsToMany(db.usuario, {
    through: "UsuarioRoles",
    foreignKey: "rolId",
    otherKey: "usuarioId"
});

// Exportamos los roles para usarlos fácilmente en la aplicación.
// Esta es la lista actualizada.
db.ROLES = ["administrador", "referente", "asesor ventas", "gerente ventas", "contador"];


export default db;

