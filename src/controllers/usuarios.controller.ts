import { Request, Response } from 'express';
import { usuarios } from '../data/store';
import { Usuario, Rol, EstadoCuenta } from '../models/types';
import { newId, hashPassword, pick, isOneOf, ROLES, ESTADOS_CUENTA } from '../utils/helpers';

const publico = ({ passwordHash, ...rest }: Usuario) => rest;

interface CrearUsuarioBody { nombre: string; email: string; password: string; rol: Rol }
interface PatchUsuarioBody { rol?: Rol; estado?: EstadoCuenta; password?: string }

// GET /api/usuarios
export const listarUsuarios = (_req: Request, res: Response): void => {
  res.json(usuarios.filter(u => !u.eliminado).map(publico));
};

// POST /api/usuarios
export const crearUsuario = (req: Request<{}, {}, CrearUsuarioBody>, res: Response): void => {
  const { nombre, email, password, rol } = req.body ?? {};
  if (!nombre || !email || !password || !isOneOf(rol, ROLES)) {
    res.status(400).json({ error: 'nombre, email, password y rol (estudiante|docente|administrador) son obligatorios' });
    return;
  }
  if (usuarios.some(u => u.email === email && !u.eliminado)) {
    res.status(409).json({ error: 'El email ya está registrado' });
    return;
  }
  const nuevo: Usuario = {
    id: newId(), nombre, email, passwordHash: hashPassword(password),
    rol, estado: 'activo', eliminado: false, creadoEn: new Date().toISOString(),
  };
  usuarios.push(nuevo);
  res.status(201).json(publico(nuevo));
};

// GET /api/usuarios/:id
export const obtenerUsuario = (req: Request<{ id: string }>, res: Response): void => {
  const u = usuarios.find(x => x.id === req.params.id && !x.eliminado);
  if (!u) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
  res.json(publico(u));
};

// PATCH /api/usuarios/:id
export const actualizarUsuarioParcial = (
  req: Request<{ id: string }, {}, PatchUsuarioBody>, res: Response
): void => {
  const u = usuarios.find(x => x.id === req.params.id && !x.eliminado);
  if (!u) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }

  const cambios = pick<PatchUsuarioBody, keyof PatchUsuarioBody>(req.body, ['rol', 'estado', 'password']);
  if (Object.keys(cambios).length === 0) {
    res.status(400).json({ error: 'Envíe al menos uno de: rol, estado, password' });
    return;
  }
  if (cambios.rol !== undefined && !isOneOf(cambios.rol, ROLES)) {
    res.status(400).json({ error: 'Rol inválido' }); return;
  }
  if (cambios.estado !== undefined && !isOneOf(cambios.estado, ESTADOS_CUENTA)) {
    res.status(400).json({ error: 'Estado de cuenta inválido' }); return;
  }
  if (cambios.rol) u.rol = cambios.rol;
  if (cambios.estado) u.estado = cambios.estado;
  if (cambios.password) u.passwordHash = hashPassword(cambios.password);
  res.json(publico(u));
};

// DELETE /api/usuarios/:id  (eliminación lógica)
export const eliminarUsuario = (req: Request<{ id: string }>, res: Response): void => {
  const u = usuarios.find(x => x.id === req.params.id && !x.eliminado);
  if (!u) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
  u.eliminado = true;
  u.estado = 'inactivo';
  res.status(204).send();
};
