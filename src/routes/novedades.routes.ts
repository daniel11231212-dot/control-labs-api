import { Router } from 'express';
import * as c from '../controllers/novedades.controller';

const router = Router();
router.get('/', c.listarNovedades);
router.post('/', c.crearNovedad);
router.patch('/:id', c.actualizarEstadoNovedad);
export default router;
