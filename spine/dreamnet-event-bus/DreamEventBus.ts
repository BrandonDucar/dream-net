/**
 * Dream Event Bus - In-memory pub/sub system for agent communication
 * 
 * Phase I implementation: Simple in-memory event bus with no external dependencies.
 */

import type { EventEnvelope } from "./EventEnvelope.js";

/**
 * Event Handler - Function that handles events
 */
export type EventHandler = (event: EventEnvelope) => void | Promise<void>;

/**
 * Dream Event Bus - In-memory pub/sub system
 * 
 * Phase I: Simple in-memory implementation with no persistence or external dependencies.
 */
export class DreamEventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private eventStorage: Map<string, EventEnvelope> = new Map();
  private subscriptionCounter: number = 0;

  constructor() {
    // In-memory only, no initialization needed
  }

  /**
   * Publish an event to all subscribers
   * @param event - Event envelope to publish
   */
  publish(event: EventEnvelope): void {
    // Store event for later retrieval
    this.eventStorage.set(event.id, event);

    // Find handlers for this event type
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      // Call all handlers (synchronously for Phase I)
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          // Log error but don't break other handlers
          console.error(`[DreamEventBus] Handler error for event ${event.id}:`, error);
        }
      }
    }

    // Also check for wildcard subscribers ("*")
    const wildcardHandlers = this.handlers.get("*");
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        try {
          handler(event);
        } catch (error) {
          console.error(`[DreamEventBus] Wildcard handler error for event ${event.id}:`, error);
        }
      }
    }
  }

  /**
   * Subscribe to events of a specific type
   * @param type - Event type to subscribe to (use "*" for all events)
   * @param handler - Handler function to call when event is published
   * @returns Unsubscribe function
   */
  subscribe(type: string, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    const handlers = this.handlers.get(type)!;
    handlers.add(handler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  /**
   * Unsubscribe using the function returned from subscribe()
   * (This is a convenience method - the returned function from subscribe() works the same)
   */
  unsubscribe(type: string, handler: EventHandler): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    }
  }

  /**
   * Get an event envelope by ID
   * @param eventId - Event ID to retrieve
   * @returns Event envelope or undefined if not found
   */
  getEnvelope(eventId: string): EventEnvelope | undefined {
    return this.eventStorage.get(eventId);
  }

  /**
   * Clear all events from storage (useful for testing)
   */
  clearStorage(): void {
    this.eventStorage.clear();
  }

  /**
   * Get count of stored events
   */
  getEventCount(): number {
    return this.eventStorage.size;
  }

  /**
   * Get count of subscribers for a type
   */
  getSubscriberCount(type: string): number {
    return this.handlers.get(type)?.size ?? 0;
  }
}

