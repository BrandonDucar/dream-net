/**
 * Nerve Bus - Pro-grade event bus with backpressure, priorities, and pluggable transports
 *
 * @module @dreamnet/nerve/bus
 */
import type { NerveEvent, NerveChannelId } from './types.js';
/**
 * Nerve Subscriber - Callback function for event handling
 */
export type NerveSubscriber = (event: NerveEvent) => void | Promise<void>;
/**
 * Nerve Transport - Pluggable transport for external event routing
 */
export interface NerveTransport {
    /** Transport name */
    name: string;
    /**
     * Send event to transport
     *
     * @param event - Nerve event to send
     */
    send(event: NerveEvent): void | Promise<void>;
}
/**
 * Drop policy for queue management
 */
export type DropPolicy = "drop_oldest" | "drop_lowest_priority" | "block";
/**
 * Nerve Bus Options
 */
export interface NerveBusOptions {
    /** Maximum queue size per priority tier */
    maxQueueSize?: number;
    /** Drop policy when queue is full */
    dropPolicy?: DropPolicy;
    /** Default sample rate (0-1) */
    defaultSampleRate?: number;
}
/**
 * Nerve Bus Stats
 */
export interface NerveBusStats {
    /** Total events published */
    published: number;
    /** Total events dropped */
    dropped: number;
    /** Events by channel */
    byChannel: Record<string, number>;
    /** Events by kind */
    byKind: Record<string, number>;
    /** Events by priority */
    byPriority: Record<string, number>;
    /** Current queue size */
    queueSize: number;
}
/**
 * Nerve Bus Interface
 */
export interface NerveBus {
    /**
     * Publish an event to the bus
     *
     * @param event - Nerve event to publish
     */
    publish(event: NerveEvent): void;
    /**
     * Subscribe to events on a specific channel
     *
     * @param channelId - Channel to subscribe to
     * @param subscriber - Callback function
     * @returns Unsubscribe function
     */
    subscribe(channelId: NerveChannelId, subscriber: NerveSubscriber): () => void;
    /**
     * Subscribe to all events across all channels
     *
     * @param subscriber - Callback function
     * @returns Unsubscribe function
     */
    subscribeAll(subscriber: NerveSubscriber): () => void;
    /**
     * Register a transport for external event routing
     *
     * @param transport - Transport implementation
     */
    registerTransport(transport: NerveTransport): void;
    /**
     * Get bus statistics
     *
     * @returns Bus stats
     */
    getStats(): NerveBusStats;
    /**
     * Get subscriber count for a channel (for debugging)
     *
     * @param channelId - Channel ID
     * @returns Number of subscribers
     */
    getSubscriberCount(channelId?: NerveChannelId): number;
    /**
     * Set metabolic pressure for systemic task shedding
     *
     * @param score - Pressure score (0-100)
     */
    setMetabolicPressure(score: number): void;
}
/**
 * Create an in-memory Nerve Bus with backpressure and queue management
 *
 * @param options - Bus configuration options
 * @returns NerveBus instance
 */
export declare function createInMemoryNerveBus(options?: NerveBusOptions): NerveBus;
/**
 * Singleton Nerve Bus instance with production defaults
 */
export declare const NERVE_BUS: NerveBus;
//# sourceMappingURL=bus.d.ts.map