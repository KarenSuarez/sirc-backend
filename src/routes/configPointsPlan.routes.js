import { Router } from "express";
import { listarConfigPlanes, actualizarConfigPlan } from "../controllers/configPointsPlan.controller.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.get("/", 
    [authJwt.verifyToken, authJwt.hasRole('admin')], 
    listarConfigPlanes
);
router.post("/", 
    [authJwt.verifyToken, authJwt.hasRole('admin')], 
    actualizarConfigPlan
);

export default router;
