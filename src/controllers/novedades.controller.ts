import { Request, Response } from 'express';
import { novedades, equipos, ambientes } from '../data/store';
import { Novedad, EstadoNovedad, Prioridad } from '../models/types';
import { newId, isOneOf, ESTADOS_NOVEDAD, PRIORIDADES } from '../utils/helpers';

interface CrearNovedadBody {
  descripcion: string; prioridad?: Prioridad;
  equipoId?: string; ambienteId?: string; reportadoPor?: string;
}
interface PatchNovedadBody { estado?: EstadoNovedad }

// POST /api/novedades
export const crearNovedad = (req: Request<{}, {}, CrearNovedadBody>, res: Response): void => {
  const { descripcion, prioridad = 'media', equipoId, ambienteId, reportadoPor } = req.body ?? {};
  if (!descripcion || (!equipoId && !ambienteId)) {
    res.status(400).json({ error: 'descripcion y al menos un equipoId o ambienteId son obligatorios' }); return;
  }
  if (!isOneOf(prioridad, PRIORIDADES)) { res.status(400).json({ error: 'Prioridad inválida' }); return; }
  if (equipoId && !equipos.some(e => e.id === equipoId)) {
    res.status(404).json({ error: 'Equipo no encontrado' }); return;
  }
  if (ambienteId && !ambientes.some(a => a.id === ambienteId)) {
    res.status(404).json({ error: 'Ambiente no encontrado' }); return;
  }
  const nueva: Novedad = {
    id: newId(), descripcion, prioridad, estado: 'pendiente',
    equipoId, ambienteId, reportadoPor, creadoEn: new Date().toISOString(),
  };
  novedades.push(nueva);
  res.status(201).json(nueva);
};

// GET /api/novedades
export const listarNovedades = (_req: Request, res: Response): void => {
  res.json(novedades);
};

// PATCH /api/novedades/:id
export const actualizarEstadoNovedad = (
  req: Request<{ id: string }, {}, PatchNovedadBody>, res: Response
): void => {
  const n = novedades.find(x => x.id === req.params.id);
  if (!n) { res.status(404).json({ error: 'Novedad no encontrada' }); return; }
  const estado = req.body?.estado;
  if (!isOneOf(estado, ESTADOS_NOVEDAD)) {
    res.status(400).json({ error: 'estado debe ser: pendiente | en_proceso | resuelto' }); return;
  }
  n.estado = estado;
  res.json(n);
};
