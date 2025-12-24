import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../config/logger';

/**
 * Middleware pour valider les requêtes avec express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('Validation error', {
      path: req.path,
      errors: errors.array(),
    });

    res.status(400).json({
      error: 'Validation error',
      details: errors.array(),
    });
    return;
  }

  next();
};
