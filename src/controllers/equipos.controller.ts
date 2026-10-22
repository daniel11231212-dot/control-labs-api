
import { Request, Response } from 'express';
import { equipos, ambientes } from '../data/store';
import { Equipo, EstadoEquipo } from '../models/types';
import {
  newId,
  pick,
  isOneOf,
  ESTADOS_EQUIPO
} from '../utils/helpers';

interface CrearEquipoBody {
  nombre: string;
  serial: string;
  ambienteId: string;
}

interface PatchEquipoBody {
  estado?: EstadoEquipo;
  ambienteId?: string;
  nombre?: string;
}

interface FiltroEquipos {
  ambienteId?: string;
}

export const crearEquipo = (
  req: Request<{}, {}, CrearEquipoBody>,
  res: Response
): void => {
  const { nombre, serial, ambienteId } = req.body ?? {};

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof serial !== 'string' ||
    !serial.trim() ||
    typeof ambienteId !== 'string' ||
    !ambienteId.trim()
  ) {
    res.status(400).json({
      error: 'nombre, serial y ambienteId son obligatorios'
    });
    return;
  }

  const serialNormalizado = serial.trim();

  if (
    equipos.some(
      equipo => equipo.serial.toLowerCase() === serialNormalizado.toLowerCase()
    )
  ) {
    res.status(409).json({ error: 'El serial ya esta registrado' });
    return;
  }

  if (!ambientes.some(a => a.id === ambienteId)) {
    res.status(404).json({ error: 'El ambiente indicado no existe' });
    return;
  }

  const nuevo: Equipo = {
    id: newId(),
    nombre: nombre.trim(),
    serial: serialNormalizado,
    ambienteId,
    estado: 'operativo'
  };

  equipos.push(nuevo);
  res.status(201).json(nuevo);
};

export const listarEquipos = (
  req: Request<{}, {}, {}, FiltroEquipos>,
  res: Response
): void => {
  const { ambienteId } = req.query;

  if (ambienteId !== undefined && typeof ambienteId !== 'string') {
    res.status(400).json({
      error: 'El filtro ambienteId debe ser un unico valor de texto'
    });
    return;
  }

  if (ambienteId && !ambientes.some(a => a.id === ambienteId)) {
    res.status(404).json({ error: 'El ambiente indicado no existe' });
    return;
  }

  const resultado = ambienteId
    ? equipos.filter(e => e.ambienteId === ambienteId)
    : equipos;

  res.json(resultado);
};

export const actualizarEquipoParcial = (
  req: Request<{ id: string }, {}, PatchEquipoBody>,
  res: Response
): void => {
  const equipo = equipos.find(e => e.id === req.params.id);

  if (!equipo) {
    res.status(404).json({ error: 'Equipo no encontrado' });
    return;
  }

  const cambios = pick<PatchEquipoBody, keyof PatchEquipoBody>(
    req.body,
    ['estado', 'ambienteId', 'nombre']
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
    cambios.estado !== undefined &&
    !isOneOf(cambios.estado, ESTADOS_EQUIPO)
  ) {
    res.status(400).json({ error: 'Estado tecnico invalido' });
    return;
  }

  if (
    cambios.ambienteId !== undefined &&
    !ambientes.some(a => a.id === cambios.ambienteId)
  ) {
    res.status(404).json({ error: 'El ambiente destino no existe' });
    return;
  }

  if (cambios.nombre !== undefined) {
    equipo.nombre = cambios.nombre.trim();
  }

  if (cambios.estado !== undefined) {
    equipo.estado = cambios.estado;
  }

  if (cambios.ambienteId !== undefined) {
    equipo.ambienteId = cambios.ambienteId;
  }

  res.json(equipo);
};
