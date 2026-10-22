import { Router } from 'express';
import { obtenerResumen } from '../controllers/dashboard.controller';

const router = Router();
router.get('/resumen', obtenerResumen);
export default router;
