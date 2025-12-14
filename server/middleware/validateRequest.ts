/**
 * Request Validation Middleware
 * Uses Zod schemas to validate request bodies, query params, and route params
 */

import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { logger } from "../utils/logger";

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
      const traceId = (req as any).traceId || 'unknown';
      
      if (error instanceof z.ZodError) {
        // Log validation errors for debugging
        logger.warn('Request validation failed', {
          traceId,
          route: req.path,
          method: req.method,
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
        
        return res.status(400).json({
          ok: false,
          error: 'validation_error',
          message: 'Invalid request data',
          traceId,
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      logger.error('Request validation error', error instanceof Error ? error : new Error(String(error)), {
        traceId,
        route: req.path,
        method: req.method
      });
      
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: 'Request validation failed',
        traceId
      });
    }
  };
}

/**
 * Common validation schemas for reuse
 */
export const commonSchemas = {
  /**
   * Pagination query parameters
   */
  pagination: z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1).pipe(z.number().int().positive()),
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 20).pipe(z.number().int().positive().max(100)),
  }),
  
  /**
   * Wallet address validation
   */
  walletAddress: z.string()
    .min(1, 'Wallet address is required')
    .regex(/^(0x)?[0-9a-fA-F]+$/, 'Wallet address must be a valid hexadecimal string')
    .refine((val) => {
      const hexPart = val.startsWith('0x') ? val.slice(2) : val;
      return hexPart.length >= 20 && hexPart.length <= 64;
    }, 'Wallet address length is invalid (expected 20-64 hex characters)'),
  
  /**
   * Ethereum address (strict 42 characters)
   */
  ethereumAddress: z.string()
    .regex(/^0x[0-9a-fA-F]{40}$/, 'Must be a valid Ethereum address (0x followed by 40 hex characters)'),
  
  /**
   * Non-empty string
   */
  nonEmptyString: z.string().min(1, 'String cannot be empty'),
  
  /**
   * Optional non-empty string
   */
  optionalString: z.string().optional(),
  
  /**
   * Positive integer
   */
  positiveInt: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .or(z.number().int().positive()),
  
  /**
   * Optional positive integer
   */
  optionalPositiveInt: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional()
    .or(z.number().int().positive().optional()),
};

