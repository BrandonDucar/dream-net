/**
 * Event Envelope - Standardized event structure for Spine Event Bus
 * 
 * Simple, flat structure for Phase I implementation.
 * Can evolve to include routing/processing metadata in Phase II.
 */

/**
 * Event Envelope - Standard event envelope structure
 */
export interface EventEnvelope {
  /** Unique event ID */
  id: string;
  /** Event type (e.g., "Security.ThreatDetected", "Browser.NavigationAttempted") */
  type: string;
  /** Timestamp when event was created */
  timestamp: number;
  /** Source system/component that emitted the event */
  source: string;
  /** Event payload (event-specific data) */
  payload: unknown;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Correlation ID for tracing events across systems */
  correlationId?: string;
}

/**
 * Create an event envelope with auto-generated ID and timestamp
 */
export function createEventEnvelope(params: {
  type: string;
  source: string;
  payload?: unknown;
  metadata?: Record<string, unknown>;
  correlationId?: string;
}): EventEnvelope {
  // Generate ID: use crypto.randomUUID() if available, else timestamp-based
  let id: string;
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    id = crypto.randomUUID();
  } else {
    id = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  return {
    id,
    type: params.type,
    timestamp: Date.now(),
    source: params.source,
    payload: params.payload ?? {},
    metadata: params.metadata,
    correlationId: params.correlationId,
  };
}

/**
 * Helper: Create a security event envelope
 */
export function createSecurityEvent(
  type: string,
  source: string,
  payload: unknown,
  correlationId?: string
): EventEnvelope {
  return createEventEnvelope({
    type: `Security.${type}`,
    source,
    payload,
    correlationId,
    metadata: { category: 'security' },
  });
}

/**
 * Helper: Create a browser event envelope
 */
export function createBrowserEvent(
  type: string,
  source: string,
  payload: unknown,
  correlationId?: string
): EventEnvelope {
  return createEventEnvelope({
    type: `Browser.${type}`,
    source,
    payload,
    correlationId,
    metadata: { category: 'browser' },
  });
}

