import { Request, Response } from 'express';
import { usuarios, ambientes, equipos, novedades } from '../data/store';

// GET /api/dashboard/resumen
export const obtenerResumen = (_req: Request, res: Response): void => {
  res.json({
    usuarios: usuarios.filter(u => !u.eliminado).length,
    ambientesActivos: ambientes.filter(a => a.estado === 'operativo').length,
    equiposOperativos: equipos.filter(e => e.estado === 'operativo').length,
    novedadesCriticasSinResolver: novedades.filter(
      n => n.prioridad === 'critica' && n.estado !== 'resuelto'
    ).length,
  });
};
