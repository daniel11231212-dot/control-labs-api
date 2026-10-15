export type Rol = 'estudiante' | 'docente' | 'administrador';
export type EstadoCuenta = 'activo' | 'inactivo' | 'suspendido';
export type EstadoAmbiente = 'operativo' | 'mantenimiento' | 'inactivo';
export type EstadoEquipo = 'operativo' | 'mantenimiento' | 'dañado' | 'baja';
export type EstadoNovedad = 'pendiente' | 'en_proceso' | 'resuelto';
export type Prioridad = 'baja' | 'media' | 'critica';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: Rol;
  estado: EstadoCuenta;
  eliminado: boolean; // eliminación lógica
  creadoEn: string;
}

export interface Ambiente {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  estado: EstadoAmbiente;
}

export interface Equipo {
  id: string;
  nombre: string;
  serial: string;
  ambienteId: string;
  estado: EstadoEquipo;
}

export interface Novedad {
  id: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: EstadoNovedad;
  equipoId?: string;
  ambienteId?: string;
  reportadoPor?: string;
  creadoEn: string;
}
