/**
 * Correlation ID Utilities
 * 
 * Generates correlation IDs for tracing events across systems.
 */

/**
 * Generate a correlation ID
 * Uses UUID v4 if available, else timestamp-based ID
 */
export function generateCorrelationId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `corr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a correlation context object
 */
export interface CorrelationContext {
  correlationId: string;
  callerId?: string;
  tierId?: string;
  timestamp: number;
}

/**
 * Create a correlation context
 */
export function createCorrelationContext(params: {
  callerId?: string;
  tierId?: string;
  correlationId?: string;
}): CorrelationContext {
  return {
    correlationId: params.correlationId ?? generateCorrelationId(),
    callerId: params.callerId,
    tierId: params.tierId,
    timestamp: Date.now(),
  };
}

