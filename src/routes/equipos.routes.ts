import { Router } from 'express';
import * as c from '../controllers/equipos.controller';

const router = Router();
router.get('/', c.listarEquipos);
router.post('/', c.crearEquipo);
router.patch('/:id', c.actualizarEquipoParcial);
export default router;
