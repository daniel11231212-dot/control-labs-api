
import { Request, Response, NextFunction } from 'express';

export const validateAmbientePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body)
  ) {
    res.status(400).json({
      success: false,
      error: 'El cuerpo de la solicitud es inválido.'
    });
    return;
  }

  const data = body as Record<string, unknown>;

  if (req.method === 'POST') {
    if (
      typeof data.nombre !== 'string' ||
      !data.nombre.trim() ||
      typeof data.ubicacion !== 'string' ||
      !data.ubicacion.trim() ||
      typeof data.capacidad !== 'number' ||
      !Number.isInteger(data.capacidad) ||
      data.capacidad <= 0
    ) {
      res.status(400).json({
        success: false,
        error: 'Ingrese nombre, ubicación y capacidad entera mayor que cero.'
      });
      return;
    }
  }

  if (req.method === 'PATCH') {
    const allowedFields = ['nombre', 'ubicacion', 'capacidad', 'estado'];
    const fields = Object.keys(data).filter(key =>
      allowedFields.includes(key)
    );

    if (
      fields.length === 0 ||
      fields.some(key => {
        const value = data[key];

        if (key === 'capacidad') {
          return typeof value !== 'number' ||
            !Number.isInteger(value) ||
            value <= 0;
        }

        return typeof value !== 'string' || !value.trim();
      })
    ) {
      res.status(400).json({
        success: false,
        error: 'Envíe campos válidos para actualizar el ambiente.'
      });
      return;
    }
  }

  next();
};
