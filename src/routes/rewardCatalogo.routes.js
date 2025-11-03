import {Router} from 'express'
import rewardCatalogoController from "../controllers/rewardCatalogo.controller.js";
import authJwt from '../middlewares/authJwt.js';


const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
  );
  next();
});

router.get('/listarCatalogo', 
  [authJwt.verifyToken, authJwt.hasRole('gerente'), authJwt.isAliveToken],
  rewardCatalogoController.getCatalogo    
);
router.patch('/nivel',
  [authJwt.verifyToken, authJwt.hasRole('gerente'), authJwt.isAliveToken],
  rewardCatalogoController.actualizarNivel
);
export default router;
