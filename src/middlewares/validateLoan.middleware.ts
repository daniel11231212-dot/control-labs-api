
import { Request, Response, NextFunction } from 'express';

export const validateLoanPayload = (
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
      error: 'Cuerpo inválido.'
    });
    return;
  }

  const loan = body as Record<string, unknown>;

  if (
    typeof loan.aula !== 'string' ||
    loan.aula.trim() === '' ||
    typeof loan.numeroPC !== 'number' ||
    !Number.isInteger(loan.numeroPC) ||
    loan.numeroPC <= 0 ||
    typeof loan.nombreGuardaEntrega !== 'string' ||
    loan.nombreGuardaEntrega.trim() === '' ||
    typeof loan.instructorRecibe !== 'string' ||
    loan.instructorRecibe.trim() === ''
  ) {
    res.status(400).json({
      success: false,
      error: 'Faltan datos válidos del préstamo.'
    });
    return;
  }

  next();
};
