/**
 * API Request Validation using Zod
 * 
 * Provides middleware and utilities for validating API requests
 */

import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validate request body against Zod schema
 */
export function validateBody<T extends z.ZodTypeAny>(
  schema: T
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Request validation failed",
          errors,
        });
      }

      // Replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: error.message || "Validation failed",
      });
    }
  };
}

/**
 * Validate request query parameters against Zod schema
 */
export function validateQuery<T extends z.ZodTypeAny>(
  schema: T
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Query validation failed",
          errors,
        });
      }

      // Replace req.query with validated data
      req.query = result.data as any;
      next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: error.message || "Validation failed",
      });
    }
  };
}

/**
 * Validate request params against Zod schema
 */
export function validateParams<T extends z.ZodTypeAny>(
  schema: T
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Params validation failed",
          errors,
        });
      }

      // Replace req.params with validated data
      req.params = result.data as any;
      next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: error.message || "Validation failed",
      });
    }
  };
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  url: z.string().url(),
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  sort: z.enum(["asc", "desc"]).default("desc"),
};

