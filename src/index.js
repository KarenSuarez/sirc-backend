import express from 'express';
import cors from 'cors';
import db from './models/index.js';
import mainRouter from './routes/index.routes.js';

// --- Inicialización de Express ---
const app = express();

// --- Middlewares ---
// Habilita CORS para permitir peticiones desde otros dominios
app.use(cors());
// Parsea las peticiones con content-type - application/json
app.use(express.json());
// Parsea las peticiones con content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// --- Conexión y Sincronización con la Base de Datos ---
// Usar { force: true } solo en desarrollo para resetear la BD en cada reinicio.
// En producción, esto debe ser removido.
db.sequelize.sync({ force: true }).then(() => {
  console.log('Base de datos sincronizada.');
  // Función para inicializar roles
  initialRoles();
  initialTipoDocumentos();
});

function initialRoles() {
    const Role = db.rol;
    Role.create({
        id_rol: 1,
        nombre_rol: 'admin'
    });
    Role.create({
        id_rol: 2,
        nombre_rol: 'referente'
    });
    Role.create({
        id_rol: 3,
        nombre_rol: 'gerente ventas'
    });
}
function initialTipoDocumentos() {
    const TipoDocumento = db.tipoDocumento;
    TipoDocumento.create({
        id_tipo_documento: 1,
        nombre: 'Cedula de ciudadanía'
    });
    TipoDocumento.create({
        id_tipo_documento: 2,
        nombre: 'Pasaporte'
    });
    TipoDocumento.create({
        id_tipo_documento: 3,
        nombre: 'Cedula de Extranjería'
    });
    TipoDocumento.create({
        id_tipo_documento: 4,
        nombre: 'RUT'
    });
}


// --- Rutas Principales ---
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido al API de Referidos y Fidelización.' });
});

// Rutas de la aplicación
app.use('/api', mainRouter);


// --- Iniciar Servidor ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.`);
});
