import { Router } from "express";
import {
  listarBeneficios,
  crearBeneficio,
  actualizarBeneficio,
} from "../controllers/beneficios.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.get("/", listarBeneficios);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], crearBeneficio);
router.put("/:id_beneficio", [authJwt.verifyToken, authJwt.isAdmin], actualizarBeneficio);

export default router;
