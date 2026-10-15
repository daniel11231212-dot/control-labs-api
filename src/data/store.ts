// Almacén en memoria para el taller. En producción se reemplaza por una BD.
import { Usuario, Ambiente, Equipo, Novedad } from '../models/types';

export const usuarios: Usuario[] = [];
export const ambientes: Ambiente[] = [];
export const equipos: Equipo[] = [];
export const novedades: Novedad[] = [];
