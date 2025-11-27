/**
 * Dream Event Bus - Basic pub/sub skeleton for agent communication
 * 
 * This will be filled by Antigravity with actual event bus logic.
 */

import type { DreamNetEvent, EventType } from "./EventTypes.js";
import type { EventEnvelope } from "./EventEnvelope.js";

/**
 * Event Handler - Function that handles events
 */
export type EventHandler = (event: DreamNetEvent) => void | Promise<void>;

/**
 * Dream Event Bus - Pub/sub system for agent events
 * Empty implementation - Antigravity will fill this
 */
export class DreamEventBus {
  constructor() {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Publish event
   * @param event - Event to publish
   */
  publish(event: DreamNetEvent): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Subscribe to event type
   * @param eventType - Event type to subscribe to
   * @param handler - Handler function
   * @returns Subscription ID
   */
  subscribe(eventType: EventType, handler: EventHandler): string {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Unsubscribe from event type
   * @param subscriptionId - Subscription ID
   */
  unsubscribe(subscriptionId: string): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get event envelope
   * @param eventId - Event ID
   * @returns Event envelope or undefined
   */
  getEnvelope(eventId: string): EventEnvelope | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

