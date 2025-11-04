/**
 * @swagger
 * components:
 *   schemas:
 *     nivel:
 *       type: object
 *       properties:
 *         id_nivel:
 *           type: integer
 *           example: 1
 *         nombre_nivel:
 *           type: string
 *           example: "Oro"
 *         puntos_maximos:
 *           type: integer
 *           example: 200
 *         puntos_minimos:
 *           type: integer
 *           example: 100
 *         porcentaje_beneficio_adicional:
 *           type: number
 *           format: float
 *           example: 5.5
 *         descripcion:
 *           type: string
 *           example: "Nivel oro para usuarios destacados"
 *         orden:
 *           type: integer
 *           example: 2
 *         esta_activa:
 *           type: boolean
 *           example: true
 *         creado_en:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T12:00:00Z"
 *     plan:
 *       $ref: '#/components/schemas/Plan'
 *     NivelesUpdate:
 *       type: object
 *       properties:
 *         id_nivel:
 *           type: integer
 *           description: ID de la categoría a actualizar
 *           example: 1
 *         nombre_nivel:
 *           type: string
 *           description: Nuevo nombre de la categoría
 *           example: "Oro"
 *         orden:
 *           type: integer
 *           description: Nuevo orden de la categoría
 *           example: 2
 *         puntos_minimos:
 *           type: integer
 *           description: Puntos mínimos requeridos
 *           example: 100
 *         puntos_maximos:
 *           type: integer
 *           description: Puntos máximos permitidos
 *           example: 200
 *         porcentaje_beneficio_adicional:
 *           type: number
 *           format: float
 *           description: Porcentaje de beneficio adicional
 *           example: 5.5
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *           example: "Nivel oro para usuarios destacados"
 *         esta_activa:
 *           type: boolean
 *           description: Si la categoría está activa
 *           example: true
 *     NivelesYPlanesResponse:
 *       type: object
 *       properties:
 *         todasLosniveles:
 *           type: array
 *           description: Lista de todos los niveles de usuario disponibles.
 *           items:
 *             $ref: "#/components/schemas/Nivel"
 *         todosLosPlanes:
 *           type: array
 *           description: Lista de todos los planes disponibles.
 *           items:
 *             $ref: "#/components/schemas/Plan"
 *       example:
 *         todasLosniveles:
 *           - id_nivel: 1
 *             nombre_nivel: "Bronce"
 *             porcentaje_beneficio_adicional: 0
 *             descripcion: null
 *             puntos_minimos: 20
 *             puntos_maximos: 0
 *             orden: 1
 *             activo: true
 *           - id_nivel: 2
 *             nombre_nivel: "Plata"
 *             porcentaje_beneficio_adicional: 5
 *             descripcion: null
 *             puntos_minimos: 21
 *             puntos_maximos: 50
 *             orden: 2
 *             activo: true
 *         todosLosPlanes:
 *           - id_plan: 1
 *             nombre_plan: "Plan Básico"
 *             precio_actual: 80000
 *             porcentaje_recompensa: 10
 *             puntos_otorgados: 100
 *             descripcion: "Perfecto para emprendedores y pequeños negocios"
 *             estado: "activo"
 *             creado_en: "2025-11-01T01:04:03.000Z"
 *             actualizado_en: "2025-11-01T01:04:03.000Z"
 *           - id_plan: 2
 *             nombre_plan: "Plan Profesional"
 *             precio_actual: 150000
 *             porcentaje_recompensa: 12
 *             puntos_otorgados: 150
 *             descripcion: "Ideal para empresas en crecimiento"
 *             estado: "activo"
 *             creado_en: "2025-11-01T01:04:03.000Z"
 *             actualizado_en: "2025-11-01T01:04:03.000Z"
 *     Usuario:
 *       type: object
 *       description: Representa un usuario del sistema.
 *       properties:
 *         numero_documento_identidad:
 *           type: string
 *           description: Número de documento de identidad del usuario.
 *           example: "12"
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del usuario.
 *           example: "john.doe@example.com"
 *         contrasena_hash:
 *           type: string
 *           description: Hash de la contraseña del usuario.
 *           example: "$2a$08$N9qo8uLOickgx2ZMRZo5i.U..."
 *         nombre:
 *           type: string
 *           description: Nombre del usuario.
 *           example: "John"
 *         apellido:
 *           type: string
 *           description: Apellido del usuario.
 *           example: "Doe"
 *         telefono:
 *           type: string
 *           description: Teléfono del usuario (opcional).
 *           example: "1234567890"
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del usuario.
 *           example: "2025-09-29T20:00:00Z"
 *         id_tipo_documento:
 *           type: integer
 *           description: ID del tipo de documento asociado al usuario.
 *           example: 1
 *       required:
 *         - correo_electronico
 *         - contrasena_hash
 *         - nombre
 *         - apellido
 *         - numero_documento_identidad
 *     UsuarioUpdate:
 *       type: object
 *       description: Campos opcionales para actualizar un usuario.
 *       properties:
 *         correo_electronico:
 *           type: string
 *           description: Nuevo correo electrónico.
 *           example: "new.email@example.com"
 *         nombre:
 *           type: string
 *           description: Nuevo nombre.
 *           example: "Jane"
 *         apellido:
 *           type: string
 *           description: Nuevo apellido.
 *           example: "Smith"
 *         telefono:
 *           type: string
 *           description: Nuevo teléfono.
 *           example: "9876543210"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudRecompensa:
 *       type: object
 *       properties:
 *         id_solicitud:
 *           type: integer
 *           example: 1
 *         documento_referente:
 *           type: string
 *           example: "1234567890"
 *         valor_retirar:
 *           type: number
 *           format: decimal
 *           example: 50000.00
 *         tipo_banco:
 *           type: string
 *           example: "Bancolombia"
 *         numero_cuenta:
 *           type: string
 *           example: "0123456789"
 *         estado_solicitud:
 *           type: string
 *           enum: [pendiente, en proceso, completada, rechazada]
 *           default: pendiente
 *         tipo_solicitud:
 *           type: string
 *           enum: [Transferencia Bancaria, Bono de Descuento en Plan]
 *           default: Transferencia Bancaria
 *         comprobante_pago:
 *           type: string
 *           nullable: true
 *         observaciones:
 *           type: string
 *           nullable: true
 *         id_usuario_procesador:
 *           type: string
 *           nullable: true
 *         fecha_solicitud:
 *           type: string
 *           format: date-time
 *         fecha_procesamiento:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fecha_actualizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *       required:
 *         - documento_referente
 *         - valor_retirar
 *         - tipo_banco
 *         - numero_cuenta
 */