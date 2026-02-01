/**
 * Error Logging Middleware
 * Structured error logging for production monitoring
 */

import type { Request, Response, NextFunction } from "express";

interface LogContext {
  traceId?: string;
  method: string;
  path: string;
  ip?: string;
  userAgent?: string;
  error: Error;
  statusCode?: number;
}

function logError(context: LogContext) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    ...context,
    error: {
      name: context.error.name,
      message: context.error.message,
      stack: process.env.NODE_ENV === 'development' ? context.error.stack : undefined
    }
  };
  
  // In production, you'd send this to a logging service (Sentry, DataDog, etc.)
  // For now, use structured console logging
  console.error('[ERROR]', JSON.stringify(logEntry, null, 2));
  
  // TODO: Integrate with Sentry or other error tracking service
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(context.error, { extra: logEntry });
  // }
}

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const traceId = (req as any).traceId || 'unknown';
  
  logError({
    traceId,
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
    error: err instanceof Error ? err : new Error(String(err)),
    statusCode: err.status || err.statusCode
  });
  
  next(err);
}

