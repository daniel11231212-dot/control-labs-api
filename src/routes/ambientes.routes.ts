import { Router } from 'express';
import * as c from '../controllers/ambientes.controller';

const router = Router();
router.get('/', c.listarAmbientes);
router.post('/', c.crearAmbiente);
router.patch('/:id', c.actualizarAmbienteParcial);
export default router;
