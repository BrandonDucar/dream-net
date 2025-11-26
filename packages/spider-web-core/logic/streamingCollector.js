/**
 * Real-Time Streaming Data Collector
 * Kafka-like architecture for real-time event streaming and processing
 */
import { SpiderWebCore } from "../index";
/**
 * Streaming Data Collector
 * Collects and processes events in real-time
 */
export class StreamingCollector {
    eventStream = [];
    processors = new Map();
    maxStreamSize = 10000; // Keep last 10k events
    processingInterval = 1000; // Process every 1 second
    intervalId = null;
    constructor() {
        // Start processing loop
        this.start();
    }
    /**
     * Start the streaming collector
     */
    start() {
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
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log("[StreamingCollector] Stopped");
    }
    /**
     * Collect an event
     */
    collectEvent(type, source, payload, partition) {
        const event = {
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
        SpiderWebCore.createFly("data-stream", source, {
            eventId: event.id,
            type: event.type,
            payload: event.payload,
            timestamp: event.timestamp,
        }, "medium", false);
        return event;
    }
    /**
     * Register a stream processor
     */
    registerProcessor(processor) {
        this.processors.set(processor.name, processor);
        console.log(`[StreamingCollector] Registered processor: ${processor.name}`);
    }
    /**
     * Unregister a stream processor
     */
    unregisterProcessor(name) {
        this.processors.delete(name);
        console.log(`[StreamingCollector] Unregistered processor: ${name}`);
    }
    /**
     * Process the event stream
     */
    async processStream() {
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
                }
                else {
                    // Handle each event individually
                    for (const event of transformedEvents) {
                        await processor.handler(event);
                    }
                }
            }
            catch (error) {
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
    getRecentEvents(limit = 100) {
        return this.eventStream.slice(-limit);
    }
    /**
     * Get events by type
     */
    getEventsByType(type) {
        return this.eventStream.filter(event => event.type === type);
    }
    /**
     * Get events by source
     */
    getEventsBySource(source) {
        return this.eventStream.filter(event => event.source === source);
    }
}
// Export singleton instance
export const streamingCollector = new StreamingCollector();
