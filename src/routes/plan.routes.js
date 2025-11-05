import { Router } from "express";
import planController from "../controllers/plan.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.post(
  "/",
  [authJwt.verifyToken, authJwt.hasRole('admin')],
  planController.crearPlan,
);

router.put("/:id_plan", [authJwt.verifyToken, authJwt.hasRole('admin')],
  planController.actualizarPlan,);

router.delete("/:id_plan", [authJwt.verifyToken, authJwt.hasRole('admin')],
  planController.eliminarPlan,);

export default router;