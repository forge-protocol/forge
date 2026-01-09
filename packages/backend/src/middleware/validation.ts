import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';

export function validatePaymentRequest<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Validation failed', {
          errors: error.errors,
          body: req.body
        });

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }

      logger.error('Unexpected validation error', error);
      return res.status(500).json({
        success: false,
        error: 'Internal validation error'
      });
    }
  };
}

export function validateQueryParams<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Query validation failed', {
          errors: error.errors,
          query: req.query
        });

        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }

      logger.error('Unexpected query validation error', error);
      return res.status(500).json({
        success: false,
        error: 'Internal validation error'
      });
    }
  };
}