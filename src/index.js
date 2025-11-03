import express from "express";
import cors from "cors";
import path from "path";
import db from "./models/index.js";
import mainRouter from "./routes/index.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import initializeData from "./utils/initializeData.js";

// --- Inicialización de Express ---
const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Conexión y Sincronización con la Base de Datos ---
db.sequelize.sync({ alter: true }).then(async () => {
  console.log("OK_SYNC Base de datos sincronizada.");
  
  /**
   * Inserta datos iniciales solo si las tablas están vacías, datos 
   * [Niveles:4, roles:4, tipoDocumento:3, planes:3] Bulk storage
   */
  await initializeData(db);
});

// --- Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Referidos Clarisa Cloud",
      version: "1.0.0",
      description: "Documentación de la API de Referidos y Fidelización",
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(process.cwd(), "src/controllers/*.js"), // tus controladores
    path.join(process.cwd(), "src/routes/*.js"), // tus rutas
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Ruta para Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//ruta de prueba conexión exitosa
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido al API de Referidos y Fidelización." });
});

//ruta principal para gestión de los servicios
app.use("/api", mainRouter);

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.`);
});
