/**
 * Real-Time Streaming Data Collector
 * Kafka-like architecture for real-time event streaming and processing
 */

import { SpiderWebCore } from "../index";
import type { Fly } from "../types";

export interface StreamEvent {
  id: string;
  type: string;
  source: string;
  payload: Record<string, any>;
  timestamp: number;
  partition?: string;
  offset?: number;
}

export interface StreamProcessor {
  name: string;
  filter?: (event: StreamEvent) => boolean;
  transform?: (event: StreamEvent) => StreamEvent;
  aggregate?: (events: StreamEvent[]) => any;
  handler: (event: StreamEvent) => Promise<void> | void;
}

/**
 * Streaming Data Collector
 * Collects and processes events in real-time
 */
export class StreamingCollector {
  private eventStream: StreamEvent[] = [];
  private processors: Map<string, StreamProcessor> = new Map();
  private maxStreamSize: number = 10000; // Keep last 10k events
  private processingInterval: number = 1000; // Process every 1 second
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Start processing loop
    this.start();
  }

  /**
   * Start the streaming collector
   */
  start(): void {
    if (this.intervalId) {
      return; // Already running
    }

    this.intervalId = setInterval(() => {
      this.processStream();
    }, this.processingInterval);

    console.log("[StreamingCollector] Started - processing events every", this.processingInterval, "ms");
  }

  /**
   * Stop the streaming collector
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log("[StreamingCollector] Stopped");
  }

  /**
   * Collect an event
   */
  collectEvent(
    type: string,
    source: string,
    payload: Record<string, any>,
    partition?: string
  ): StreamEvent {
    const event: StreamEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      source,
      payload,
      timestamp: Date.now(),
      partition,
    };

    // Add to stream
    this.eventStream.push(event);

    // Trim stream if too large
    if (this.eventStream.length > this.maxStreamSize) {
      this.eventStream.shift();
    }

    // Also emit to Spider Web Core as fly
    SpiderWebCore.createFly(
      "data-stream",
      source,
      {
        eventId: event.id,
        type: event.type,
        payload: event.payload,
        timestamp: event.timestamp,
      },
      "medium",
      false
    );

    return event;
  }

  /**
   * Register a stream processor
   */
  registerProcessor(processor: StreamProcessor): void {
    this.processors.set(processor.name, processor);
    console.log(`[StreamingCollector] Registered processor: ${processor.name}`);
  }

  /**
   * Unregister a stream processor
   */
  unregisterProcessor(name: string): void {
    this.processors.delete(name);
    console.log(`[StreamingCollector] Unregistered processor: ${name}`);
  }

  /**
   * Process the event stream
   */
  private async processStream(): Promise<void> {
    if (this.eventStream.length === 0) {
      return; // No events to process
    }

    // Get events since last processing (or all if first run)
    const eventsToProcess = this.eventStream.slice(); // Process all for now

    // Process each registered processor
    for (const [name, processor] of this.processors.entries()) {
      try {
        // Filter events if filter provided
        let filteredEvents = eventsToProcess;
        if (processor.filter) {
          filteredEvents = eventsToProcess.filter(processor.filter);
        }

        // Transform events if transform provided
        let transformedEvents = filteredEvents;
        if (processor.transform) {
          transformedEvents = filteredEvents.map(processor.transform);
        }

        // Aggregate if aggregate provided
        if (processor.aggregate && transformedEvents.length > 0) {
          const aggregated = processor.aggregate(transformedEvents);
          // Handle aggregated result
          await processor.handler({
            id: `aggregated-${Date.now()}`,
            type: "aggregated",
            source: processor.name,
            payload: aggregated,
            timestamp: Date.now(),
          });
        } else {
          // Handle each event individually
          for (const event of transformedEvents) {
            await processor.handler(event);
          }
        }
      } catch (error: any) {
        console.error(`[StreamingCollector] Error in processor ${name}:`, error.message);
      }
    }
  }

  /**
   * Get stream statistics
   */
  getStats() {
    return {
      eventCount: this.eventStream.length,
      processorCount: this.processors.size,
      oldestEvent: this.eventStream[0]?.timestamp || null,
      newestEvent: this.eventStream[this.eventStream.length - 1]?.timestamp || null,
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 100): StreamEvent[] {
    return this.eventStream.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string): StreamEvent[] {
    return this.eventStream.filter(event => event.type === type);
  }

  /**
   * Get events by source
   */
  getEventsBySource(source: string): StreamEvent[] {
    return this.eventStream.filter(event => event.source === source);
  }
}

// Export singleton instance
export const streamingCollector = new StreamingCollector();

