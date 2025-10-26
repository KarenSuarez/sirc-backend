import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './models/index.js';
import mainRouter from './routes/index.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import "./tasks/inactivarReferidos.task.js";


// --- Inicialización de Express ---
const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Conexión y Sincronización con la Base de Datos ---
db.sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Base de datos sincronizada.');

  // Inserta datos iniciales solo si las tablas están vacías
  const countDocs = await db.tipoDocumento.count();
  const countRoles = await db.rol.count();

  if (countDocs === 0) {
    console.log('🟡 Insertando tipos de documento iniciales...');
    await initialTipoDocumentos();
  } else {
    console.log('✅ Tipos de documento ya existen, no se insertan nuevamente.');
  }

  if (countRoles === 0) {
    console.log('🟢 Insertando roles iniciales...');
    await initialRoles();
  } else {
    console.log('✅ Roles ya existen, no se insertan nuevamente.');
  }
});


// Inicialización de Roles
function initialRoles() {
  const Role = db.rol;
  Role.create({ id_rol: 1, nombre_rol: 'admin' });
  Role.create({ id_rol: 2, nombre_rol: 'referente' });
  Role.create({ id_rol: 3, nombre_rol: 'gerente ventas' });
  Role.create({ id_rol: 4, nombre_rol: 'asesor' });
  Role.create({ id_rol: 5, nombre_rol: 'contador' });
}

// Inicialización de Tipos de Documento
function initialTipoDocumentos() {
  const TipoDocumento = db.tipoDocumento;
  TipoDocumento.create({ id_tipo_documento: 1, nombre: 'Cedula de ciudadanía' });
  TipoDocumento.create({ id_tipo_documento: 2, nombre: 'Pasaporte' });
  TipoDocumento.create({ id_tipo_documento: 3, nombre: 'Cedula de Extranjería' });
  TipoDocumento.create({ id_tipo_documento: 4, nombre: 'RUT' });
}

// --- Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Referidos Clarisa Cloud",
      version: "1.0.0",
      description: "Documentación de la API de Referidos y Fidelización",
    },
    servers: [
      { url: "http://localhost:5000/api" },
    ],
  },
  apis: [
    path.join(process.cwd(), "src/controllers/*.js"), // tus controladores
    path.join(process.cwd(), "src/routes/*.js")       // tus rutas
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Ruta para Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Rutas Principales ---
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido al API de Referidos y Fidelización.' });
});

app.use('/api', mainRouter);

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.`);
});