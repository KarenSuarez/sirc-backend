import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./models/index.js";
import mainRouter from "./routes/index.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerSchemas from "./config/swaggerSchemas.js";
import initializeData from "./utils/initializeData.js";
import createLogger from "./utils/logger.js";

const logger = createLogger("index.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ alter: true }).then(async () => {
  logger.info("OK_SYNC Base de datos sincronizada.");
  await initializeData(db);
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Referidos Clarisa Cloud",
      version: "2.0.0",
      description:
        "Documentación completa de la API de Referidos y Fidelización v2.0 - Sistema con comisiones automatizadas, niveles de fidelización, dashboard y KPIs",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Servidor de desarrollo local",
      },
      {
        url: "https://api.clarisacloud.com/api",
        description: "Servidor de producción",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT estándar en header Authorization",
        },
        tokenAuth: {
          type: "apiKey",
          in: "header",
          name: "x-access-token",
          description: "Token JWT en header personalizado x-access-token",
        },
      },
      schemas: swaggerSchemas,
    },
    security: [
      {
        tokenAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Autenticación (register, login, logout)",
      },
      {
        name: "Usuarios",
        description: "Gestión de usuarios (Admin)",
      },
      {
        name: "Usuarios Admin",
        description: "Funciones específicas de administrador",
      },
      {
        name: "Usuarios Gerente",
        description: "Funciones específicas de gerente de ventas",
      },
      {
        name: "Referente",
        description: "Dashboard y perfil del referente",
      },
      {
        name: "Referidos",
        description: "Gestión de referidos (Referente)",
      },
      {
        name: "Solicitudes",
        description: "Solicitudes de retiro y recompensas",
      },
      {
        name: "Asesor - Referidos",
        description: "Gestión de referidos (Asesor de Ventas)",
      },
      {
        name: "Asesor - Referentes",
        description: "Información de referentes (Asesor de Ventas)",
      },
      {
        name: "Contador",
        description: "Gestión de solicitudes de pago (Contador)",
      },
      {
        name: "Planes",
        description: "Gestión de planes comerciales (CRUD)",
      },
      {
        name: "Niveles",
        description: "Gestión de niveles de fidelización (CRUD)",
      },
      {
        name: "Insignias",
        description: "Gestión de insignias/logros",
      },
      {
        name: "KPI",
        description: "Indicadores clave de rendimiento (Admin/Gerente)",
      },
      {
        name: "Puntos",
        description: "Gestión y consulta de puntos de fidelización",
      },
      {
        name: "Ranking",
        description: "Rankings de referentes (puntos, comisiones, referidos)",
      },

      {
        name: "Sistema",
        description: "Health checks y utilidades",
      },
    ],
  },
  apis: [
    path.join(__dirname, "routes/**/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { 
        display: none; 
      }
      .swagger-ui .info .title {
        font-size: 2.5rem;
        color: #172c44ff;
      }
      .swagger-ui .info .description {
        font-size: 1.1rem;
      }
    `,
    customSiteTitle: "API Referidos - Clarisa Cloud",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: "monokai",
      },
    },
  })
);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

logger.info(`Swagger docs disponibles en: http://localhost:5000/api-docs`);

/**
 * @swagger
 * /:
 * get:
 * summary: Health check principal
 * description: Verifica que el servidor esté funcionando
 * tags: [Sistema]
 * responses:
 * 200:
 * description: Servidor funcionando correctamente
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Bienvenido al API de Referidos y Fidelización v2.0
 */
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido al API de Referidos y Fidelización v2.0",
    version: "2.0.0",
    docs: "http://localhost:5000/api-docs",
    status: "OK",
  });
});

/**
 * @swagger
 * /storeReferidos:
 * get:
 * summary: Almacenar referidos de prueba (TESTING)
 * description: Endpoint de prueba para cargar datos de referidos en bulk
 * tags: [Sistema]
 * responses:
 * 200:
 * description: Referidos almacenados exitosamente
 * 500:
 * description: Error al almacenar referidos
 */
app.get("/storeReferidos", async (req, res) => {
  try {
    const result = await bulkStoreReferidos(db);
    res.json({ message: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error al almacenar los referidos.",
      error: error.message,
    });
  }
});

// --- Rutas principales de la API ---
app.use("/api", mainRouter);

app.use((req, res) => {
  logger.warn(`Ruta no encontrada (404): ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: "Endpoint no encontrado",
    path: req.originalUrl,
    method: req.method,
    suggestion: "Verifica la documentación en /api-docs",
  });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({
    message: "Error interno del servidor",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Error interno",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Servidor SIRC Backend corriendo en: http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  logger.warn("SIGTERM recibido, cerrando servidor...");
  await db.sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.warn("SIGINT recibido, cerrando servidor...");
  await db.sequelize.close();
  process.exit(0);
});

export default app;
