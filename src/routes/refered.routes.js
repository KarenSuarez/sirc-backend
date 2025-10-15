import { Router } from 'express';
import referedController from '../controllers/refered.controller.js';
import authJwt from '../middlewares/authJwt.js';

const router = Router();

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

/**
 * @swagger
 * tags:
 *   name: Referidos
 *   description: Endpoints relacionados con los referidos
 */

router.post(
    "/referir",
    [
        authJwt.verifyToken,
        authJwt.isReferente,
        referedController.checkDuplicateReferedEmail
    ],
    referedController.createRefered
);

router.get("/", referedController.getAll);
router.get("/mis-referidos", [authJwt.verifyToken, authJwt.isReferente], referedController.getByReferente);
router.get("/pendientes", referedController.getEstadoPendiente);
router.patch("/:documento_identidad_referido/estado", [authJwt.verifyToken, authJwt.hasRole("asesor")], referedController.updateEstado);

export default router;