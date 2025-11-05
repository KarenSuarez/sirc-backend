import {Router} from 'express'
import rewardCatalogoController from "../controllers/rewardCatalogo.controller.js";
import authJwt from '../middlewares/authJwt.js';


const router = Router();



router.get('/listarCatalogo', 
  [authJwt.verifyToken, authJwt.hasRole('admin'), authJwt.isAliveToken],
  rewardCatalogoController.getCatalogo    
);


export default router;
