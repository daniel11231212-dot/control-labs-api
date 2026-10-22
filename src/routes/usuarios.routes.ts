
import { Router } from 'express';
import * as c from '../controllers/usuarios.controller';
import { validateUserPayload } from '../middlewares/validateUser.middleware';

const router = Router();

router.get('/', c.listarUsuarios);
router.post('/', validateUserPayload, c.crearUsuario);
router.get('/:id', c.obtenerUsuario);
router.patch('/:id', validateUserPayload, c.actualizarUsuarioParcial);
router.delete('/:id', c.eliminarUsuario);

export default router;
