
import { Router } from 'express';
import * as c from '../controllers/ambientes.controller';
import { validateAmbientePayload } from '../middlewares/validateAmbientemiddleware';

const router = Router();

router.get('/', c.listarAmbientes);
router.post('/', validateAmbientePayload, c.crearAmbiente);
router.patch('/:id', validateAmbientePayload, c.actualizarAmbienteParcial);

export default router;