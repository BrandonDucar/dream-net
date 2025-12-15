/**
 * Error Logging Middleware
 * Structured error logging for production monitoring
 */

import type { Request, Response, NextFunction } from "express";
import { logger } from '../utils/logger';

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const traceId = (req as any).traceId || 'unknown';
  const error = err instanceof Error ? err : new Error(String(err));
  
  // Use centralized logger with request context
  logger.error(
    `Request failed: ${error.message}`,
    error,
    {
      requestId: traceId,
    method: req.method,
      route: req.path,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
      statusCode: err.status || err.statusCode || 500,
      // Include error details for debugging
      errorName: error.name,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  );
  
  // TODO: Integrate with Sentry or other error tracking service
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(error, {
  //     tags: { traceId, method: req.method, path: req.path },
  //     extra: { ip: req.ip, userAgent: req.get('user-agent') }
  //   });
  // }
  
  next(err);
}

