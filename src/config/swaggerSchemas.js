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
 */