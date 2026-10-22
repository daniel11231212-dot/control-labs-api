
import { Request, Response } from 'express';
import { ambientes } from '../data/store';
import { Ambiente, EstadoAmbiente } from '../models/types';
import {
  newId,
  pick,
  isOneOf,
  ESTADOS_AMBIENTE
} from '../utils/helpers';

interface CrearAmbienteBody {
  nombre: string;
  ubicacion: string;
  capacidad: number;
}

interface PatchAmbienteBody {
  nombre?: string;
  ubicacion?: string;
  capacidad?: number;
  estado?: EstadoAmbiente;
}

export const listarAmbientes = (_req: Request, res: Response): void => {
  res.json(ambientes);
};

export const crearAmbiente = (
  req: Request<{}, {}, CrearAmbienteBody>,
  res: Response
): void => {
  const { nombre, ubicacion, capacidad } = req.body ?? {};

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof ubicacion !== 'string' ||
    !ubicacion.trim() ||
    typeof capacidad !== 'number' ||
    !Number.isInteger(capacidad) ||
    capacidad <= 0
  ) {
    res.status(400).json({
      error: 'nombre, ubicacion y capacidad entera mayor que cero son obligatorios'
    });
    return;
  }

  const nuevo: Ambiente = {
    id: newId(),
    nombre: nombre.trim(),
    ubicacion: ubicacion.trim(),
    capacidad,
    estado: 'operativo'
  };

  ambientes.push(nuevo);
  res.status(201).json(nuevo);
};

export const actualizarAmbienteParcial = (
  req: Request<{ id: string }, {}, PatchAmbienteBody>,
  res: Response
): void => {
  const ambiente = ambientes.find(a => a.id === req.params.id);

  if (!ambiente) {
    res.status(404).json({ error: 'Ambiente no encontrado' });
    return;
  }

  const cambios = pick<PatchAmbienteBody, keyof PatchAmbienteBody>(
    req.body,
    ['nombre', 'ubicacion', 'capacidad', 'estado']
  );

  if (Object.keys(cambios).length === 0) {
    res.status(400).json({
      error: 'Debe enviar al menos un campo para actualizar'
    });
    return;
  }

  if (
    cambios.nombre !== undefined &&
    (typeof cambios.nombre !== 'string' || !cambios.nombre.trim())
  ) {
    res.status(400).json({ error: 'El nombre no es valido' });
    return;
  }

  if (
    cambios.ubicacion !== undefined &&
    (typeof cambios.ubicacion !== 'string' || !cambios.ubicacion.trim())
  ) {
    res.status(400).json({ error: 'La ubicacion no es valida' });
    return;
  }

  if (
    cambios.capacidad !== undefined &&
    (typeof cambios.capacidad !== 'number' ||
      !Number.isInteger(cambios.capacidad) ||
      cambios.capacidad <= 0)
  ) {
    res.status(400).json({
      error: 'La capacidad debe ser un entero mayor que cero'
    });
    return;
  }

  if (
    cambios.estado !== undefined &&
    !isOneOf(cambios.estado, ESTADOS_AMBIENTE)
  ) {
    res.status(400).json({ error: 'Estado de ambiente invalido' });
    return;
  }

  if (cambios.nombre !== undefined) {
    ambiente.nombre = cambios.nombre.trim();
  }

  if (cambios.ubicacion !== undefined) {
    ambiente.ubicacion = cambios.ubicacion.trim();
  }

  if (cambios.capacidad !== undefined) {
    ambiente.capacidad = cambios.capacidad;
  }

  if (cambios.estado !== undefined) {
    ambiente.estado = cambios.estado;
  }

  res.json(ambiente);
};
