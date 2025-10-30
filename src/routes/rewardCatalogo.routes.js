import {Router} from 'express'
import rewardCatalogoController from "../controllers/rewardCatalogo.controller";
import authJwt from '../middlewares/authJwt';


const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
  );
  next();
});

router.get('/listaPuntos/:nombreCatalogo', 
            [authJwt.isReferente],
            rewardCatalogoController.getCatalogoPuntosPorCategoria
)
