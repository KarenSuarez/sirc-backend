import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import pointsController from "../controllers/points.controller.js";

const router = Router();

router.get("/referente", [authJwt.verifyToken, authJwt.isReferente], pointsController.consultarPuntos);

export default router;
