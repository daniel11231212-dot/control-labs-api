import { Request, Response } from 'express';
import { ambientes } from '../data/store';
import { Ambiente, EstadoAmbiente } from '../models/types';
import { newId, pick, isOneOf, ESTADOS_AMBIENTE } from '../utils/helpers';

interface CrearAmbienteBody { nombre: string; ubicacion: string; capacidad: number }
interface PatchAmbienteBody { nombre?: string; ubicacion?: string; capacidad?: number; estado?: EstadoAmbiente }

// GET /api/ambientes
export const listarAmbientes = (_req: Request, res: Response): void => {
  res.json(ambientes);
};

// POST /api/ambientes
export const crearAmbiente = (req: Request<{}, {}, CrearAmbienteBody>, res: Response): void => {
  const { nombre, ubicacion, capacidad } = req.body ?? {};
  if (!nombre || !ubicacion || !Number.isInteger(capacidad) || capacidad <= 0) {
    res.status(400).json({ error: 'nombre, ubicacion y capacidad (entero > 0) son obligatorios' });
    return;
  }
  const nuevo: Ambiente = { id: newId(), nombre, ubicacion, capacidad, estado: 'operativo' };
  ambientes.push(nuevo);
  res.status(201).json(nuevo);
};

// PATCH /api/ambientes/:id
export const actualizarAmbienteParcial = (
  req: Request<{ id: string }, {}, PatchAmbienteBody>, res: Response
): void => {
  const a = ambientes.find(x => x.id === req.params.id);
  if (!a) { res.status(404).json({ error: 'Ambiente no encontrado' }); return; }

  const c = pick<PatchAmbienteBody, keyof PatchAmbienteBody>(req.body, ['nombre', 'ubicacion', 'capacidad', 'estado']);
  if (Object.keys(c).length === 0) { res.status(400).json({ error: 'No hay campos para actualizar' }); return; }
  if (c.capacidad !== undefined && (!Number.isInteger(c.capacidad) || c.capacidad <= 0)) {
    res.status(400).json({ error: 'capacidad debe ser un entero > 0' }); return;
  }
  if (c.estado !== undefined && !isOneOf(c.estado, ESTADOS_AMBIENTE)) {
    res.status(400).json({ error: 'Estado de ambiente inválido' }); return;
  }
  Object.assign(a, c);
  res.json(a);
};
