import { Router } from 'express';
import * as c from '../controllers/usuarios.controller';

const router = Router();
router.get('/', c.listarUsuarios);
router.post('/', c.crearUsuario);
router.get('/:id', c.obtenerUsuario);
router.patch('/:id', c.actualizarUsuarioParcial);
router.delete('/:id', c.eliminarUsuario);
export default router;
