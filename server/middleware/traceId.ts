/**
 * X-Trace-Id Middleware
 * Generates and propagates trace IDs for request tracking and debugging
 */

import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

export interface TraceContext {
  traceId: string;
  spanId?: string;
  parentSpanId?: string;
}

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      traceContext?: TraceContext;
    }
  }
}

/**
 * Generate a trace ID (format: timestamp-hex)
 */
export function generateTraceId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString("hex");
  return `${timestamp}-${random}`;
}

/**
 * Extract or generate trace ID from request headers
 */
export function getTraceId(req: Request): string {
  // Check for existing trace ID in headers
  const headerTraceId = req.headers["x-trace-id"] || req.headers["x-request-id"];
  
  if (typeof headerTraceId === "string" && headerTraceId.length > 0) {
    return headerTraceId;
  }
  
  // Generate new trace ID
  return generateTraceId();
}

/**
 * Trace ID middleware - adds trace ID to all requests
 */
export function traceIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const traceId = getTraceId(req);
  
  // Attach to request
  req.traceId = traceId;
  req.traceContext = {
    traceId,
    spanId: randomBytes(4).toString("hex"),
  };
  
  // Add to response headers
  res.setHeader("X-Trace-Id", traceId);
  
  // Log trace ID for debugging
  if (process.env.DEBUG_TRACE === "true") {
    console.log(`[Trace] ${req.method} ${req.path} - Trace-ID: ${traceId}`);
  }
  
  next();
}

/**
 * Create a child span for nested operations
 */
export function createChildSpan(parentTraceId: string, parentSpanId: string): TraceContext {
  return {
    traceId: parentTraceId,
    parentSpanId: parentSpanId,
    spanId: randomBytes(4).toString("hex"),
  };
}

/**
 * Format trace context for logging
 */
export function formatTraceContext(context: TraceContext): string {
  return `trace=${context.traceId} span=${context.spanId}${context.parentSpanId ? ` parent=${context.parentSpanId}` : ""}`;
}

