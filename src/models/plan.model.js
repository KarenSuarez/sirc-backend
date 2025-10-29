/**
 * @swagger
 * components:
 *   schemas:
 *     Plan:
 *       type: object
 *       required:
 *         - nombre_plan
 *         - precio_actual
 *         - porcentaje_recompensa
 *         - puntos_otorgados
 *       properties:
 *         id_plan:
 *           type: integer
 *           description: ID único del plan (autogenerado)
 *           example: 1
 *         nombre_plan:
 *           type: string
 *           maxLength: 50
 *           description: Nombre del plan de servicio
 *           example: "Plan Premium"
 *         precio_actual:
 *           type: number
 *           format: decimal
 *           description: Precio actual del plan en moneda local
 *           example: 150000.00
 *         porcentaje_recompensa:
 *           type: number
 *           format: decimal
 *           description: Porcentaje de recompensa por referido convertido
 *           example: 15.50
 *         puntos_otorgados:
 *           type: integer
 *           description: Puntos otorgados al referente por conversión
 *           example: 100
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del plan
 *           example: "Plan premium con todas las funcionalidades incluidas"
 *         estado:
 *           type: string
 *           enum: [activo, inactivo, descontinuado]
 *           default: activo
 *           description: Estado actual del plan
 *           example: "activo"
 *         creado_en:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del plan
 *           example: "2025-10-14T10:30:00.000Z"
 *         actualizado_en:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2025-10-14T15:45:00.000Z"
 *       example:
 *         id_plan: 1
 *         nombre_plan: "Plan Empresarial"
 *         precio_actual: 250000.00
 *         porcentaje_recompensa: 20.00
 *         puntos_otorgados: 150
 *         descripcion: "Plan ideal para empresas con múltiples usuarios"
 *         estado: "activo"
 *         creado_en: "2025-10-14T10:30:00.000Z"
 *         actualizado_en: "2025-10-14T10:30:00.000Z"
 *
 *     PlanInput:
 *       type: object
 *       required:
 *         - nombre_plan
 *         - precio_actual
 *         - porcentaje_recompensa
 *         - puntos_otorgados
 *       properties:
 *         nombre_plan:
 *           type: string
 *           maxLength: 50
 *           example: "Plan Premium"
 *         precio_actual:
 *           type: number
 *           example: 150000.00
 *         porcentaje_recompensa:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 15.50
 *         puntos_otorgados:
 *           type: integer
 *           minimum: 0
 *           example: 100
 *         descripcion:
 *           type: string
 *           example: "Descripción del plan"
 *         estado:
 *           type: string
 *           enum: [activo, inactivo, descontinuado]
 *           default: activo
 *           example: "activo"
 */

export default (sequelize, Sequelize) => {
  const Plan = sequelize.define(
    "Plan",
    {
      id_plan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre_plan: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      precio_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      porcentaje_recompensa: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      puntos_otorgados: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo", "descontinuado"),
        defaultValue: "activo",
      },
      creado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "Plan",
      timestamps: false,
    },
  );

  return Plan;
};
