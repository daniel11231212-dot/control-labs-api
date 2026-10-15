import { randomUUID, randomBytes, scryptSync } from 'crypto';

export const newId = (): string => randomUUID();

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
};

/** Devuelve solo las claves permitidas que vengan en el body (base del PATCH). */
export function pick<T extends object, K extends keyof T>(
  body: Partial<T> | undefined,
  allowed: readonly K[]
): Partial<Pick<T, K>> {
  const out: Partial<Pick<T, K>> = {};
  if (!body) return out;
  for (const k of allowed) if (body[k] !== undefined) out[k] = body[k];
  return out;
}

export const isOneOf = <T extends string>(v: unknown, list: readonly T[]): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v);

export const ROLES = ['estudiante', 'docente', 'administrador'] as const;
export const ESTADOS_CUENTA = ['activo', 'inactivo', 'suspendido'] as const;
export const ESTADOS_AMBIENTE = ['operativo', 'mantenimiento', 'inactivo'] as const;
export const ESTADOS_EQUIPO = ['operativo', 'mantenimiento', 'dañado', 'baja'] as const;
export const ESTADOS_NOVEDAD = ['pendiente', 'en_proceso', 'resuelto'] as const;
export const PRIORIDADES = ['baja', 'media', 'critica'] as const;
