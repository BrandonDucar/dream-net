/**
 * Event Envelope - Metadata wrapper for events
 * 
 * Wraps events with additional metadata for routing and processing
 */

import type { DreamNetEvent } from "./EventTypes.js";

/**
 * Event Envelope - Wraps event with metadata
 */
export interface EventEnvelope {
  /** Wrapped event */
  event: DreamNetEvent;
  /** Routing metadata */
  routing?: {
    /** Route path */
    path?: string[];
    /** Route hops */
    hops?: number;
    /** Route timestamp */
    routeTimestamp?: number;
  };
  /** Processing metadata */
  processing?: {
    /** Processing attempts */
    attempts?: number;
    /** Processing deadline */
    deadline?: number;
    /** Processing status */
    status?: "pending" | "processing" | "completed" | "failed";
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

