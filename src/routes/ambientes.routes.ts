
import { Router } from 'express';
import * as c from '../controllers/ambientes.controller';
import { validateEnvironmentPayload } from '../middlewares/validateEnvironment.middleware';

const router = Router();

router.get('/', c.listarAmbientes);
router.post('/', validateEnvironmentPayload, c.crearAmbiente);
router.patch('/:id', validateEnvironmentPayload, c.actualizarAmbienteParcial);

export default router;
