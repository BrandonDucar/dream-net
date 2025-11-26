/**
 * GPT Event Stream
 * 
 * Integrates GPTs with Starbridge for real-time event streaming.
 * Enables GPTs to emit events and subscribe to events.
 */

import { StarbridgeTopic, StarbridgeSource, type StarbridgeEvent } from "../starbridge/types";
import { broadcastStarbridgeEvent, subscribeToTopics } from "../starbridge/bus";
import { gptAgentRegistry } from "./GPTAgentRegistry";
import { cleanGPTId } from "./mappers";

export interface GPTEvent {
  id: string;
  gptId: string;
  gptName: string;
  eventType: GPTEventType;
  payload: Record<string, any>;
  timestamp: Date;
}

export type GPTEventType =
  | "gpt.registered"
  | "gpt.message.sent"
  | "gpt.message.received"
  | "gpt.query.executed"
  | "gpt.output.generated"
  | "gpt.workflow.started"
  | "gpt.workflow.completed"
  | "gpt.workflow.failed"
  | "gpt.memory.stored"
  | "gpt.heartbeat"
  | "gpt.error"
  | "gpt.status.changed";

export interface GPTEventSubscription {
  subscriptionId: string;
  gptId?: string;
  eventTypes?: GPTEventType[];
  topics?: StarbridgeTopic[];
  handler: (event: GPTEvent) => void;
}

class GPTEventStream {
  private subscriptions: Map<string, GPTEventSubscription> = new Map();
  private starbridgeUnsubscribers: Map<string, () => void> = new Map();

  /**
   * Emit a GPT event to Starbridge
   */
  async emitGPTEvent(
    gptId: string,
    eventType: GPTEventType,
    payload: Record<string, any> = {}
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      // Resolve GPT
      const gpt = gptAgentRegistry.getAllGPTs().find(
        (g) => g.name === gptId || cleanGPTId(g.name) === cleanGPTId(gptId)
      );

      if (!gpt) {
        return { success: false, error: `GPT not found: ${gptId}` };
      }

      const agentId = `gpt:${cleanGPTId(gpt.name)}`;

      // Map GPT event type to Starbridge topic
      const topic = this.mapEventTypeToTopic(eventType);
      const source = StarbridgeSource.External; // GPTs are external sources

      // Create event payload
      const eventPayload = {
        gptId: agentId,
        gptName: gpt.name,
        gptCategory: gpt.category,
        eventType,
        ...payload,
      };

      // Broadcast to Starbridge
      const event = await broadcastStarbridgeEvent({
        topic,
        source,
        type: `gpt.${eventType}`,
        payload: eventPayload,
      });

      console.log(`[GPT EventStream] Emitted event: ${eventType} from ${gpt.name} (${event.id})`);

      // Also notify local subscribers
      this.notifySubscribers({
        id: event.id,
        gptId: agentId,
        gptName: gpt.name,
        eventType,
        payload: eventPayload,
        timestamp: event.ts,
      });

      return {
        success: true,
        eventId: event.id,
      };
    } catch (error: any) {
      console.error(`[GPT EventStream] Failed to emit event:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Subscribe to GPT events
   */
  subscribe(
    handler: (event: GPTEvent) => void,
    options?: {
      gptId?: string;
      eventTypes?: GPTEventType[];
      topics?: StarbridgeTopic[];
    }
  ): string {
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const subscription: GPTEventSubscription = {
      subscriptionId,
      gptId: options?.gptId,
      eventTypes: options?.eventTypes,
      topics: options?.topics,
      handler,
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Subscribe to Starbridge topics if specified
    if (options?.topics && options.topics.length > 0) {
      const starbridgeHandler = (event: StarbridgeEvent) => {
        // Filter by GPT event type
        if (event.type.startsWith("gpt.")) {
          const eventType = event.type.replace("gpt.", "") as GPTEventType;
          
          // Check if this subscription matches
          if (options.eventTypes && !options.eventTypes.includes(eventType)) {
            return;
          }

          if (options.gptId) {
            const eventGptId = (event.payload as any)?.gptId;
            if (eventGptId && cleanGPTId(eventGptId) !== cleanGPTId(options.gptId)) {
              return;
            }
          }

          // Convert Starbridge event to GPT event
          const gptEvent: GPTEvent = {
            id: event.id,
            gptId: (event.payload as any)?.gptId || "",
            gptName: (event.payload as any)?.gptName || "",
            eventType,
            payload: event.payload || {},
            timestamp: event.ts,
          };

          handler(gptEvent);
        }
      };

      const unsubscribe = subscribeToTopics(options.topics, starbridgeHandler);
      this.starbridgeUnsubscribers.set(subscriptionId, unsubscribe);
    }

    return subscriptionId;
  }

  /**
   * Unsubscribe from GPT events
   */
  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    // Unsubscribe from Starbridge
    const unsubscriber = this.starbridgeUnsubscribers.get(subscriptionId);
    if (unsubscriber) {
      unsubscriber();
      this.starbridgeUnsubscribers.delete(subscriptionId);
    }

    this.subscriptions.delete(subscriptionId);
    return true;
  }

  /**
   * Get all active subscriptions
   */
  getSubscriptions(): GPTEventSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Map GPT event type to Starbridge topic
   */
  private mapEventTypeToTopic(eventType: GPTEventType): StarbridgeTopic {
    switch (eventType) {
      case "gpt.registered":
      case "gpt.status.changed":
        return StarbridgeTopic.System;
      case "gpt.message.sent":
      case "gpt.message.received":
      case "gpt.query.executed":
        return StarbridgeTopic.System;
      case "gpt.output.generated":
      case "gpt.memory.stored":
        return StarbridgeTopic.Vault;
      case "gpt.workflow.started":
      case "gpt.workflow.completed":
      case "gpt.workflow.failed":
        return StarbridgeTopic.Deploy;
      case "gpt.heartbeat":
        return StarbridgeTopic.System;
      case "gpt.error":
        return StarbridgeTopic.System;
      default:
        return StarbridgeTopic.System;
    }
  }

  /**
   * Notify local subscribers
   */
  private notifySubscribers(event: GPTEvent): void {
    for (const subscription of this.subscriptions.values()) {
      // Filter by GPT ID
      if (subscription.gptId && cleanGPTId(subscription.gptId) !== cleanGPTId(event.gptId)) {
        continue;
      }

      // Filter by event type
      if (subscription.eventTypes && !subscription.eventTypes.includes(event.eventType)) {
        continue;
      }

      // Call handler
      try {
        subscription.handler(event);
      } catch (error: any) {
        console.error(`[GPT EventStream] Handler error for subscription ${subscription.subscriptionId}:`, error);
      }
    }
  }

  /**
   * Get recent GPT events (from Starbridge)
   */
  async getRecentEvents(options?: {
    gptId?: string;
    eventTypes?: GPTEventType[];
    limit?: number;
    since?: Date;
  }): Promise<GPTEvent[]> {
    // This would query Starbridge repository for recent events
    // For now, return empty array (would need to implement repository query)
    // In a real implementation, this would call:
    // const events = await fetchEvents({ topics: [...], limit, since });
    // return events.filter(...).map(...);
    return [];
  }
}

// Singleton instance
export const gptEventStream = new GPTEventStream();

// Note: Auto-emit events would be integrated when GPTAgentRegistry emits events
// For now, events are emitted manually when GPTs are registered/used

