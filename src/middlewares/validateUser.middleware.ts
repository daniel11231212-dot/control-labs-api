
import { Request, Response, NextFunction } from 'express';

export const validateUserPayload = (
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
      typeof data.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      typeof data.password !== 'string' ||
      !data.password.trim() ||
      typeof data.rol !== 'string' ||
      !data.rol.trim()
    ) {
      res.status(400).json({
        success: false,
        error: 'Ingrese nombre, email válido, password y rol.'
      });
      return;
    }
  }

  if (req.method === 'PATCH') {
    const allowedFields = ['rol', 'estado', 'password'];
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
        error: 'Envíe rol, estado o password con valores válidos.'
      });
      return;
    }
  }

  next();
};
