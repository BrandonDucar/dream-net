/**
 * Event Router - Empty router for event routing
 * 
 * This will be filled by Antigravity with actual routing logic.
 */

import type { DreamNetEvent, EventType } from "./EventTypes.js";
import type { EventEnvelope } from "./EventEnvelope.js";

/**
 * Event Router - Routes events to appropriate handlers
 * Empty implementation - Antigravity will fill this
 */
export class EventRouter {
  constructor() {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Route event
   * @param event - Event to route
   * @returns Envelope with routing metadata
   */
  route(event: DreamNetEvent): EventEnvelope {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Register route handler
   * @param eventType - Event type to handle
   * @param handler - Handler function
   */
  registerHandler(eventType: EventType, handler: (event: DreamNetEvent) => void): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get routes for event type
   * @param eventType - Event type
   * @returns Array of route handlers
   */
  getRoutes(eventType: EventType): Array<(event: DreamNetEvent) => void> {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

