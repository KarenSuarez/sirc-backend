const authSchemas = {
  LoginRequest: {
    type: "object",
    required: ["numero_documento", "password"],
    properties: {
      numero_documento: {
        type: "string",
        example: "1000000001",
        description: "Número de documento del usuario",
      },
      password: {
        type: "string",
        example: "12345",
        description: "Contraseña del usuario",
      },
    },
  },

  RegisterRequest: {
    type: "object",
    required: [
      "nombre",
      "apellido",
      "correo_electronico",
      "password",
      "numero_documento",
      "id_tipo_documento",
    ],
    properties: {
      nombre: {
        type: "string",
        example: "Karen",
        description: "Nombre del usuario",
      },
      apellido: {
        type: "string",
        example: "Suarez",
        description: "Apellido del usuario",
      },
      correo_electronico: {
        type: "string",
        format: "email",
        example: "karen@test.com",
        description: "Correo electrónico del usuario",
      },
      password: {
        type: "string",
        example: "12345",
        description: "Contraseña del usuario (mínimo 5 caracteres)",
      },
      numero_documento: {
        type: "string",
        example: "1000000001",
        description: "Número de documento de identidad",
      },
      id_tipo_documento: {
        type: "integer",
        example: 1,
        description: "ID del tipo de documento (1=CC, 2=NIT, 3=CE, 4=COD)",
      },
      telefono: {
        type: "string",
        example: "3001234567",
        description: "Número de teléfono",
      },
      roles: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["referente"],
        description:
          "Roles a asignar (referente, asesor_ventas, gerente_ventas, contador, administrador)",
      },
    },
  },

  LoginResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Login exitoso",
      },
      token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Token JWT para autenticación",
      },
      usuario: {
        $ref: "#/components/schemas/Usuario",
      },
    },
  },
};

const usuarioSchemas = {
  Usuario: {
    type: "object",
    properties: {
      id_usuario: {
        type: "integer",
        example: 1,
        description: "ID único del usuario",
      },
      numero_documento: {
        type: "string",
        example: "1000000001",
      },
      nombre: {
        type: "string",
        example: "Karen",
      },
      apellido: {
        type: "string",
        example: "Suarez",
      },
      correo_electronico: {
        type: "string",
        example: "karen@test.com",
      },
      telefono: {
        type: "string",
        example: "3001234567",
      },
      fecha_registro: {
        type: "string",
        format: "date-time",
        example: "2025-11-07T17:00:00.000Z",
      },
      roles: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Rol",
        },
      },
    },
  },

  Rol: {
    type: "object",
    properties: {
      id_rol: {
        type: "integer",
        example: 2,
      },
      codigo_rol: {
        type: "string",
        example: "REF",
        description:
          "Código corto del rol (ADMIN, REF, ASESOR, GERENTE, CONTADOR)",
      },
      nombre_rol: {
        type: "string",
        example: "referente",
      },
      descripcion: {
        type: "string",
        example: "Usuario que refiere nuevos clientes",
      },
    },
  },
};

const referenteSchemas = {
  Referente: {
    type: "object",
    properties: {
      id_usuario: {
        type: "integer",
        example: 1,
      },
      codigo_referente: {
        type: "string",
        example: "REF-000001",
        description: "Código único del referente",
      },
      tipo_referente: {
        type: "string",
        enum: ["cliente_interno", "cliente_externo"],
        example: "cliente_externo",
      },
      puntos_actuales: {
        type: "integer",
        example: 50,
        description: "Puntos actuales del referente",
      },
      puntos_totales_historico: {
        type: "integer",
        example: 50,
        description: "Total de puntos acumulados históricamente",
      },
      saldo_disponible: {
        type: "number",
        format: "decimal",
        example: 5000.0,
        description: "Saldo disponible para retiro",
      },
      total_comisiones_historico: {
        type: "number",
        format: "decimal",
        example: 5000.0,
        description: "Total de comisiones generadas",
      },
      total_retirado: {
        type: "number",
        format: "decimal",
        example: 0.0,
        description: "Total de dinero retirado",
      },
      estado_referente: {
        type: "string",
        enum: ["activo", "inactivo", "suspendido"],
        example: "activo",
      },
    },
  },

  DashboardResponse: {
    type: "object",
    properties: {
      saldo: {
        type: "object",
        properties: {
          saldo_disponible: {
            type: "number",
            example: 5000,
          },
          total_comisiones_historico: {
            type: "number",
            example: 5000,
          },
          total_retirado: {
            type: "number",
            example: 0,
          },
        },
      },
      puntos: {
        type: "object",
        properties: {
          puntos_actuales: {
            type: "integer",
            example: 50,
          },
          puntos_totales_historico: {
            type: "integer",
            example: 50,
          },
        },
      },
      nivel: {
        type: "object",
        properties: {
          actual: {
            $ref: "#/components/schemas/Nivel",
          },
          progreso: {
            type: "object",
            properties: {
              puntos_faltantes: {
                type: "integer",
                example: 50,
              },
              porcentaje_progreso: {
                type: "number",
                example: 50,
              },
            },
          },
        },
      },
      referidos: {
        type: "object",
        properties: {
          total: {
            type: "integer",
            example: 1,
          },
          activos: {
            type: "integer",
            example: 1,
          },
          pendientes: {
            type: "integer",
            example: 0,
          },
        },
      },
    },
  },
};

const referidoSchemas = {
  Referido: {
    type: "object",
    properties: {
      id_referido: {
        type: "integer",
        example: 1,
      },
      id_referente: {
        type: "integer",
        example: 1,
      },
      id_asesor_vendedor: {
        type: "integer",
        example: 2,
        description: "ID del asesor de ventas que convirtió al referido",
      },
      numero_documento_referido: {
        type: "string",
        example: "2000000001",
      },
      nombre_referido: {
        type: "string",
        example: "Juan",
      },
      apellido_referido: {
        type: "string",
        example: "Pérez",
      },
      correo_referido: {
        type: "string",
        example: "juan@test.com",
      },
      telefono_referido: {
        type: "string",
        example: "3009876543",
      },
      empresa_referido: {
        type: "string",
        example: "Tech Solutions",
      },
      cargo_referido: {
        type: "string",
        example: "Gerente TI",
      },
      estado_referido: {
        type: "string",
        enum: [
          "pendiente",
          "contactado",
          "activo",
          "no_interesado",
          "inactivo",
        ],
        example: "pendiente",
      },
      fecha_referencia: {
        type: "string",
        format: "date-time",
        example: "2025-11-07T17:00:00.000Z",
      },
      fecha_conversion: {
        type: "string",
        format: "date-time",
        example: "2025-11-07T17:30:00.000Z",
      },
    },
  },

  ReferidoCreateRequest: {
    type: "object",
    required: [
      "numero_documento_referido",
      "id_tipo_documento",
      "nombre_referido",
      "apellido_referido",
      "correo_referido",
      "telefono_referido",
    ],
    properties: {
      numero_documento_referido: {
        type: "string",
        example: "2000000001",
      },
      id_tipo_documento: {
        type: "integer",
        example: 1,
      },
      nombre_referido: {
        type: "string",
        example: "Juan",
      },
      apellido_referido: {
        type: "string",
        example: "Pérez",
      },
      correo_referido: {
        type: "string",
        example: "juan@test.com",
      },
      telefono_referido: {
        type: "string",
        example: "3009876543",
      },
      empresa_referido: {
        type: "string",
        example: "Tech Solutions",
      },
      cargo_referido: {
        type: "string",
        example: "Gerente TI",
      },
      observaciones: {
        type: "string",
        example: "Cliente potencial de alto valor",
      },
    },
  },

  ConvertirReferidoRequest: {
    type: "object",
    required: ["id_plan_adquirido"],
    properties: {
      id_plan_adquirido: {
        type: "integer",
        example: 1,
        description: "ID del plan que adquirió el referido",
      },
    },
  },
};

const catalogoSchemas = {
  Plan: {
    type: "object",
    properties: {
      id_plan: {
        type: "integer",
        example: 1,
      },
      nombre_plan: {
        type: "string",
        example: "Plan Básico",
      },
      descripcion: {
        type: "string",
        example: "Plan ideal para pequeñas empresas",
      },
      precio_actual: {
        type: "number",
        format: "decimal",
        example: 290000.0,
      },
      porcentaje_comision_base: {
        type: "number",
        format: "decimal",
        example: 10.0,
      },
      puntos_otorgados: {
        type: "integer",
        example: 50,
      },
      estado_plan: {
        type: "string",
        enum: ["activo", "inactivo"],
        example: "activo",
      },
      icono_plan: {
        type: "string",
        example: "package-basic",
      },
      color_plan: {
        type: "string",
        example: "#4A90E2",
      },
    },
  },

  Nivel: {
    type: "object",
    properties: {
      id_nivel: {
        type: "integer",
        example: 1,
      },
      nombre_nivel: {
        type: "string",
        example: "Bronce",
      },
      orden_nivel: {
        type: "integer",
        example: 1,
      },
      puntos_minimos: {
        type: "integer",
        example: 0,
      },
      puntos_maximos: {
        type: "integer",
        example: 99,
      },
      porcentaje_comision_extra: {
        type: "number",
        format: "decimal",
        example: 0.0,
      },
      icono_nivel: {
        type: "string",
        example: "bronze-medal",
      },
      color_nivel: {
        type: "string",
        example: "#CD7F32",
      },
      beneficios_nivel: {
        type: "string",
        example: "Nivel inicial - Sin beneficios adicionales",
      },
      descripcion: {
        type: "string",
        example: "Nivel básico para nuevos referentes",
      },
    },
  },
};

const insigniaSchemas = {
  Insignia: {
    type: "object",
    properties: {
      id_insignia: {
        type: "integer",
        example: 1,
      },
      nombre_insignia: {
        type: "string",
        example: "Primera Venta",
      },
      descripcion: {
        type: "string",
        example: "Realizaste tu primera conversión exitosa",
      },
      icono_insignia: {
        type: "string",
        example: "first-sale",
      },
      color_insignia: {
        type: "string",
        example: "#FFD700",
      },
      criterio_obtencion: {
        type: "string",
        example: "Convertir 1 referido",
      },
      rareza: {
        type: "string",
        enum: ["comun", "rara", "epica", "legendaria"],
        example: "comun",
      },
    },
  },

  InsigniaCreateRequest: {
    type: "object",
    required: [
      "nombre_insignia",
      "descripcion",
      "icono_insignia",
      "criterio_obtencion",
    ],
    properties: {
      nombre_insignia: {
        type: "string",
        example: "Vendedor Estrella",
      },
      descripcion: {
        type: "string",
        example: "Has convertido 10 referidos",
      },
      icono_insignia: {
        type: "string",
        example: "star-seller",
      },
      color_insignia: {
        type: "string",
        example: "#FFA500",
      },
      criterio_obtencion: {
        type: "string",
        example: "Convertir 10 referidos",
      },
      rareza: {
        type: "string",
        enum: ["comun", "rara", "epica", "legendaria"],
        example: "rara",
      },
    },
  },
};

const solicitudSchemas = {
  SolicitudRecompensa: {
    type: "object",
    properties: {
      id_solicitud: {
        type: "integer",
        example: 1,
      },
      id_referente: {
        type: "integer",
        example: 1,
      },
      metodo_retiro: {
        type: "string",
        enum: ["retiro", "bono_pago"],
        example: "retiro",
      },
      monto_solicitado: {
        type: "number",
        format: "decimal",
        example: 50000.0,
      },
      estado_solicitud: {
        type: "string",
        enum: [
          "pendiente",
          "en_revision",
          "aprobada",
          "rechazada",
          "procesada",
          "pagada",
        ],
        example: "pendiente",
      },
      comprobante_pago_url: {
        type: "string",
        example: "https://storage.example.com/comprobantes/comp123.pdf",
        description: "URL del comprobante de pago (contador)",
      },
      fecha_solicitud: {
        type: "string",
        format: "date-time",
        example: "2025-11-07T17:00:00.000Z",
      },
    },
  },

  SolicitudCreateRequest: {
    type: "object",
    required: ["metodo_retiro", "monto_solicitado"],
    properties: {
      metodo_retiro: {
        type: "string",
        enum: ["retiro", "bono_pago"],
        example: "retiro",
      },
      monto_solicitado: {
        type: "number",
        example: 50000,
      },
      cuenta_destino: {
        type: "string",
        example: "1234567890",
      },
      banco_destino: {
        type: "string",
        example: "Bancolombia",
      },
    },
  },

  AprobarSolicitudRequest: {
    type: "object",
    properties: {
      comprobante_pago_url: {
        type: "string",
        example: "https://storage.example.com/comprobantes/comp123.pdf",
        description: "URL del comprobante de pago subido",
      },
      observaciones: {
        type: "string",
        example: "Pago procesado correctamente",
      },
    },
  },
};

const analyticsSchemas = {
  KPIGeneralResponse: {
    type: "object",
    properties: {
      usuarios: {
        type: "object",
        properties: {
          total: {
            type: "integer",
            example: 10,
          },
          referentes: {
            type: "object",
            properties: {
              total: {
                type: "integer",
                example: 8,
              },
              activos: {
                type: "integer",
                example: 7,
              },
            },
          },
        },
      },
      referidos: {
        type: "object",
        properties: {
          total: {
            type: "integer",
            example: 45,
          },
          activos: {
            type: "integer",
            example: 30,
          },
        },
      },
      comisiones: {
        type: "object",
        properties: {
          total: {
            type: "number",
            example: 150000,
          },
          pendientes: {
            type: "number",
            example: 20000,
          },
          pagadas: {
            type: "number",
            example: 130000,
          },
        },
      },
    },
  },

  RankingResponse: {
    type: "object",
    properties: {
      periodo: {
        type: "string",
        example: "mes",
      },
      total: {
        type: "integer",
        example: 10,
      },
      ranking: {
        type: "array",
        items: {
          type: "object",
          properties: {
            posicion: {
              type: "integer",
              example: 1,
            },
            codigo_referente: {
              type: "string",
              example: "REF-000001",
            },
            puntos_actuales: {
              type: "integer",
              example: 500,
            },
            usuario: {
              type: "object",
              properties: {
                nombre: {
                  type: "string",
                  example: "Karen",
                },
                apellido: {
                  type: "string",
                  example: "Suarez",
                },
              },
            },
          },
        },
      },
    },
  },
};

const genericSchemas = {
  SuccessResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Operación exitosa",
      },
    },
  },

  ErrorResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Error al procesar la solicitud",
      },
      error: {
        type: "string",
        example: "Detalle del error",
      },
    },
  },

  PaginatedResponse: {
    type: "object",
    properties: {
      total: {
        type: "integer",
        example: 100,
      },
      pagina: {
        type: "integer",
        example: 1,
      },
      limite: {
        type: "integer",
        example: 50,
      },
      total_paginas: {
        type: "integer",
        example: 2,
      },
      data: {
        type: "array",
        items: {
          type: "object",
        },
      },
    },
  },
};

export const swaggerSchemas = {
  ...authSchemas,
  ...usuarioSchemas,
  ...referenteSchemas,
  ...referidoSchemas,
  ...catalogoSchemas,
  ...insigniaSchemas,
  ...solicitudSchemas,
  ...analyticsSchemas,
  ...genericSchemas,
};

export default swaggerSchemas;
