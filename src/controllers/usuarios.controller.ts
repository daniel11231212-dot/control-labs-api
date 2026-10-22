
import { Request, Response } from 'express';
import { usuarios } from '../data/store';
import { Usuario, Rol, EstadoCuenta } from '../models/types';
import {
  newId,
  hashPassword,
  pick,
  isOneOf,
  ROLES,
  ESTADOS_CUENTA
} from '../utils/helpers';

const publico = ({ passwordHash, ...rest }: Usuario) => rest;

interface CrearUsuarioBody {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

interface PatchUsuarioBody {
  rol?: Rol;
  estado?: EstadoCuenta;
  password?: string;
}

export const listarUsuarios = (_req: Request, res: Response): void => {
  res.json(usuarios.filter(u => !u.eliminado).map(publico));
};

export const crearUsuario = (
  req: Request<{}, {}, CrearUsuarioBody>,
  res: Response
): void => {
  const { nombre, email, password, rol } = req.body ?? {};

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof email !== 'string' ||
    !email.trim() ||
    !email.includes('@') ||
    typeof password !== 'string' ||
    !password.trim() ||
    !isOneOf(rol, ROLES)
  ) {
    res.status(400).json({
      error: 'Ingrese nombre, email valido, password y un rol permitido'
    });
    return;
  }

  const emailNormalizado = email.trim().toLowerCase();

  if (
    usuarios.some(
      u => u.email.toLowerCase() === emailNormalizado && !u.eliminado
    )
  ) {
    res.status(409).json({
      error: 'El email ya esta registrado'
    });
    return;
  }

  const nuevo: Usuario = {
    id: newId(),
    nombre: nombre.trim(),
    email: emailNormalizado,
    passwordHash: hashPassword(password),
    rol,
    estado: 'activo',
    eliminado: false,
    creadoEn: new Date().toISOString()
  };

  usuarios.push(nuevo);
  res.status(201).json(publico(nuevo));
};

export const obtenerUsuario = (
  req: Request<{ id: string }>,
  res: Response
): void => {
  const usuario = usuarios.find(
    u => u.id === req.params.id && !u.eliminado
  );

  if (!usuario) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  res.json(publico(usuario));
};

export const actualizarUsuarioParcial = (
  req: Request<{ id: string }, {}, PatchUsuarioBody>,
  res: Response
): void => {
  const usuario = usuarios.find(
    u => u.id === req.params.id && !u.eliminado
  );

  if (!usuario) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  const cambios = pick<PatchUsuarioBody, keyof PatchUsuarioBody>(
    req.body,
    ['rol', 'estado', 'password']
  );

  if (Object.keys(cambios).length === 0) {
    res.status(400).json({
      error: 'Envia al menos uno de estos campos: rol, estado, password'
    });
    return;
  }

  if (
    cambios.rol !== undefined &&
    !isOneOf(cambios.rol, ROLES)
  ) {
    res.status(400).json({ error: 'Rol invalido' });
    return;
  }

  if (
    cambios.estado !== undefined &&
    !isOneOf(cambios.estado, ESTADOS_CUENTA)
  ) {
    res.status(400).json({ error: 'Estado de cuenta invalido' });
    return;
  }

  if (
    cambios.password !== undefined &&
    (typeof cambios.password !== 'string' || !cambios.password.trim())
  ) {
    res.status(400).json({ error: 'Password invalido' });
    return;
  }

  if (cambios.rol !== undefined) {
    usuario.rol = cambios.rol;
  }

  if (cambios.estado !== undefined) {
    usuario.estado = cambios.estado;
  }

  if (cambios.password !== undefined) {
    usuario.passwordHash = hashPassword(cambios.password);
  }

  res.json(publico(usuario));
};

export const eliminarUsuario = (
  req: Request<{ id: string }>,
  res: Response
): void => {
  const usuario = usuarios.find(
    u => u.id === req.params.id && !u.eliminado
  );

  if (!usuario) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  usuario.eliminado = true;
  usuario.estado = 'inactivo';

  res.status(204).send();
};
