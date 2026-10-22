
import { Router } from 'express';
import * as c from '../controllers/equipos.controller';
import { validateAssetPayload } from '../middlewares/validateAsset.middleware';

const router = Router();

router.get('/', c.listarEquipos);
router.post('/', validateAssetPayload, c.crearEquipo);
router.patch('/:id', validateAssetPayload, c.actualizarEquipoParcial);

export default router;
