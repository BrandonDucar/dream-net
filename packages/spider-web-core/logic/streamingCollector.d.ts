/**
 * Real-Time Streaming Data Collector
 * Kafka-like architecture for real-time event streaming and processing
 */
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
export declare class StreamingCollector {
    private eventStream;
    private processors;
    private maxStreamSize;
    private processingInterval;
    private intervalId;
    constructor();
    /**
     * Start the streaming collector
     */
    start(): void;
    /**
     * Stop the streaming collector
     */
    stop(): void;
    /**
     * Collect an event
     */
    collectEvent(type: string, source: string, payload: Record<string, any>, partition?: string): StreamEvent;
    /**
     * Register a stream processor
     */
    registerProcessor(processor: StreamProcessor): void;
    /**
     * Unregister a stream processor
     */
    unregisterProcessor(name: string): void;
    /**
     * Process the event stream
     */
    private processStream;
    /**
     * Get stream statistics
     */
    getStats(): {
        eventCount: number;
        processorCount: number;
        oldestEvent: number;
        newestEvent: number;
    };
    /**
     * Get recent events
     */
    getRecentEvents(limit?: number): StreamEvent[];
    /**
     * Get events by type
     */
    getEventsByType(type: string): StreamEvent[];
    /**
     * Get events by source
     */
    getEventsBySource(source: string): StreamEvent[];
}
export declare const streamingCollector: StreamingCollector;
