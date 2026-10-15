import { Request, Response } from 'express';
import { equipos, ambientes } from '../data/store';
import { Equipo, EstadoEquipo } from '../models/types';
import { newId, pick, isOneOf, ESTADOS_EQUIPO } from '../utils/helpers';

interface CrearEquipoBody { nombre: string; serial: string; ambienteId: string }
interface PatchEquipoBody { estado?: EstadoEquipo; ambienteId?: string; nombre?: string }
interface FiltroEquipos { ambienteId?: string }

// POST /api/equipos
export const crearEquipo = (req: Request<{}, {}, CrearEquipoBody>, res: Response): void => {
  const { nombre, serial, ambienteId } = req.body ?? {};
  if (!nombre || !serial || !ambienteId) {
    res.status(400).json({ error: 'nombre, serial y ambienteId son obligatorios' }); return;
  }
  if (!ambientes.some(a => a.id === ambienteId)) {
    res.status(404).json({ error: 'El ambiente indicado no existe' }); return;
  }
  const nuevo: Equipo = { id: newId(), nombre, serial, ambienteId, estado: 'operativo' };
  equipos.push(nuevo);
  res.status(201).json(nuevo);
};

// GET /api/equipos  |  GET /api/equipos?ambienteId=...
export const listarEquipos = (req: Request<{}, {}, {}, FiltroEquipos>, res: Response): void => {
  const { ambienteId } = req.query;
  res.json(ambienteId ? equipos.filter(e => e.ambienteId === ambienteId) : equipos);
};

// PATCH /api/equipos/:id
export const actualizarEquipoParcial = (
  req: Request<{ id: string }, {}, PatchEquipoBody>, res: Response
): void => {
  const e = equipos.find(x => x.id === req.params.id);
  if (!e) { res.status(404).json({ error: 'Equipo no encontrado' }); return; }

  const c = pick<PatchEquipoBody, keyof PatchEquipoBody>(req.body, ['estado', 'ambienteId', 'nombre']);
  if (Object.keys(c).length === 0) { res.status(400).json({ error: 'No hay campos para actualizar' }); return; }
  if (c.estado !== undefined && !isOneOf(c.estado, ESTADOS_EQUIPO)) {
    res.status(400).json({ error: 'Estado técnico inválido' }); return;
  }
  if (c.ambienteId !== undefined && !ambientes.some(a => a.id === c.ambienteId)) {
    res.status(404).json({ error: 'El ambiente destino no existe' }); return;
  }
  Object.assign(e, c);
  res.json(e);
};
