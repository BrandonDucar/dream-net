/**
 * Nervous Message Bus
 * 
 * Topic-based routing on top of Nerve Bus
 * Adds correlation IDs, TTL, role-based filtering, and topic subscriptions
 */

import { NERVE_BUS, type NerveEvent } from '@dreamnet/nerve/bus';
import type { NervousMessage, Role, Topic } from './types';

class NervousMessageBus {
  private topicSubscribers: Map<Topic, Set<(msg: NervousMessage) => void>> = new Map();
  private publishedCount = 0;
  private messageMap: Map<string, NervousMessage> = new Map(); // For TTL tracking
  
  /**
   * Publish a message to the nervous system
   */
  publish<T>(message: NervousMessage<T>): void {
    this.publishedCount++;
    
    // Check TTL
    if (message.ttlMs) {
      const expiresAt = message.ts + message.ttlMs;
      if (Date.now() > expiresAt) {
        console.warn(`[NervousMessageBus] Message ${message.id} expired before publishing`);
        return;
      }
      
      // Store for TTL tracking
      this.messageMap.set(message.id, message);
      
      // Clean up expired messages periodically
      setTimeout(() => {
        this.messageMap.delete(message.id);
      }, message.ttlMs);
    }
    
    // Convert to NerveEvent for backward compatibility
    const nerveEvent: NerveEvent = {
      id: message.id,
      channelId: `nervous.${message.topic}`,
      kind: message.role,
      priority: message.priority ?? 3,
      context: {
        topic: message.topic,
        key: message.key,
        corr: message.corr,
        ttlMs: message.ttlMs,
        sig: message.sig,
      },
      payload: message.payload,
    };
    
    // Publish to Nerve Bus (backward compatible)
    NERVE_BUS.publish(nerveEvent);
    
    // Also notify topic subscribers directly
    const subscribers = this.topicSubscribers.get(message.topic);
    if (subscribers) {
      subscribers.forEach(sub => {
        try {
          const result = sub(message);
          // Handle async subscribers
          if (result instanceof Promise) {
            result.catch((error) => {
              console.error(`[NervousMessageBus] Topic subscriber error (${message.topic}):`, error);
            });
          }
        } catch (error) {
          console.error(`[NervousMessageBus] Topic subscriber error (${message.topic}):`, error);
        }
      });
    }
  }
  
  /**
   * Subscribe to messages on a specific topic
   */
  subscribe(topic: Topic, handler: (msg: NervousMessage) => void | Promise<void>): () => void {
    if (!this.topicSubscribers.has(topic)) {
      this.topicSubscribers.set(topic, new Set());
    }
    this.topicSubscribers.get(topic)!.add(handler);
    
    // Also subscribe to Nerve Bus channel for backward compatibility
    const unsubscribeNerve = NERVE_BUS.subscribe(`nervous.${topic}`, (event: NerveEvent) => {
      const message: NervousMessage = {
        id: event.id,
        ts: Date.now(), // TODO: extract from event context if available
        role: event.kind as Role,
        topic: event.context?.topic as Topic ?? topic,
        key: event.context?.key,
        corr: event.context?.corr,
        ttlMs: event.context?.ttlMs,
        priority: event.priority as 1|2|3,
        payload: event.payload,
        sig: event.context?.sig,
      };
      handler(message);
    });
    
    return () => {
      this.topicSubscribers.get(topic)?.delete(handler);
      unsubscribeNerve();
    };
  }
  
  /**
   * Get statistics
   */
  getStats() {
    return {
      published: this.publishedCount,
      subscribers: Array.from(this.topicSubscribers.values()).reduce((sum, set) => sum + set.size, 0),
      topics: Array.from(this.topicSubscribers.keys()),
      activeMessages: this.messageMap.size,
    };
  }
}

export const nervousMessageBus = new NervousMessageBus();

