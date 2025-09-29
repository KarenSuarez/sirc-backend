import { Router } from 'express';
import authController from "../controllers/auth.controller.js";

const router = Router();

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/register",
  [
    authController.checkDuplicateEmailOrDocument
  ],
  authController.register
);

router.post("/login", authController.login);

export default router;

