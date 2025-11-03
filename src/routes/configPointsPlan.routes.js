import { Router } from "express";
import { listarConfigPlanes, actualizarConfigPlan } from "../controllers/configPointsPlan.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.get("/", 
    [authJwt.verifyToken, authJwt.hasRole('gerente'), authJwt.isAliveToken], 
    listarConfigPlanes
);
router.post("/", 
    [authJwt.verifyToken, authJwt.hasRole('gerente'), authJwt.isAliveToken], 
    actualizarConfigPlan
);

export default router;
