
import { Request, Response, NextFunction } from 'express';

export const validateAssetPayload = (
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
      typeof data.serial !== 'string' ||
      !data.serial.trim() ||
      typeof data.ambienteId !== 'string' ||
      !data.ambienteId.trim()
    ) {
      res.status(400).json({
        success: false,
        error: 'Ingrese nombre, serial y ambienteId.'
      });
      return;
    }
  }

  if (req.method === 'PATCH') {
    const allowedFields = ['nombre', 'estado', 'ambienteId'];
    const fields = Object.keys(data).filter(key =>
      allowedFields.includes(key)
    );

    if (
      fields.length === 0 ||
      fields.some(key =>
        typeof data[key] !== 'string' ||
        !(data[key] as string).trim()
      )
    ) {
      res.status(400).json({
        success: false,
        error: 'Envíe nombre, estado o ambienteId con valores válidos.'
      });
      return;
    }
  }

  next();
};
