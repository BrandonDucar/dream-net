/**
 * Request Validation Middleware
 * Uses Zod schemas to validate request bodies, query params, and route params
 */

import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateRequest(schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          ok: false,
          error: 'validation_error',
          message: 'Invalid request data',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Request validation failed'
      });
    }
  };
}

