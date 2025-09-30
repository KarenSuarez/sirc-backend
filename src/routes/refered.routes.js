import { Router } from 'express';
import referedController from '../controllers/refered.controller.js';
import authJwt  from '../middlewares/authJwt.js';

const router = Router();

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post(
    "/referir",
    [
        authJwt.verifyToken,
        authJwt.isReferente,
        referedController.checkDuplicateReferedEmail
    ],
    referedController.createRefered
);

export default router;