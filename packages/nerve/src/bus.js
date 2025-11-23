/**
 * Nerve Bus - Pro-grade event bus with backpressure, priorities, and pluggable transports
 *
 * @module @dreamnet/nerve/bus
 */
/**
 * Create an in-memory Nerve Bus with backpressure and queue management
 *
 * @param options - Bus configuration options
 * @returns NerveBus instance
 */
export function createInMemoryNerveBus(options = {}) {
    const { maxQueueSize = 10_000, dropPolicy = "drop_lowest_priority", defaultSampleRate = 0.1, } = options;
    // Map of channel ID to set of subscribers
    const channelSubscribers = new Map();
    // Global subscribers (subscribe to all channels)
    const globalSubscribers = new Set();
    // Registered transports
    const transports = new Set();
    // Event queue (priority-ordered)
    const eventQueue = [];
    // Stats tracking
    const stats = {
        published: 0,
        dropped: 0,
        byChannel: {},
        byKind: {},
        byPriority: {},
        queueSize: 0,
    };
    /**
     * Process an event (fan-out to subscribers and transports)
     */
    function processEvent(event) {
        // Skip unsampled events (unless explicitly sampled)
        if (event.context.sampled === false) {
            return;
        }
        // Notify global subscribers first
        for (const subscriber of globalSubscribers) {
            try {
                const result = subscriber(event);
                // Handle async subscribers
                if (result instanceof Promise) {
                    result.catch((error) => {
                        console.error(`[NerveBus] Global subscriber error:`, error);
                    });
                }
            }
            catch (error) {
                console.error(`[NerveBus] Global subscriber error:`, error);
            }
        }
        // Notify channel-specific subscribers
        const channelSubs = channelSubscribers.get(event.channelId);
        if (channelSubs) {
            for (const subscriber of channelSubs) {
                try {
                    const result = subscriber(event);
                    // Handle async subscribers
                    if (result instanceof Promise) {
                        result.catch((error) => {
                            console.error(`[NerveBus] Channel subscriber error (${event.channelId}):`, error);
                        });
                    }
                }
                catch (error) {
                    console.error(`[NerveBus] Channel subscriber error (${event.channelId}):`, error);
                }
            }
        }
        // Send to transports
        for (const transport of transports) {
            try {
                const result = transport.send(event);
                // Handle async transports
                if (result instanceof Promise) {
                    result.catch((error) => {
                        console.error(`[NerveBus] Transport error (${transport.name}):`, error);
                    });
                }
            }
            catch (error) {
                console.error(`[NerveBus] Transport error (${transport.name}):`, error);
            }
        }
    }
    /**
     * Drop an event based on drop policy
     */
    function dropEvent() {
        stats.dropped++;
        if (dropPolicy === "drop_oldest") {
            // Remove oldest event
            eventQueue.shift();
        }
        else if (dropPolicy === "drop_lowest_priority") {
            // Find and remove lowest priority event
            let lowestIndex = 0;
            let lowestPriority = 5;
            for (let i = 0; i < eventQueue.length; i++) {
                if (eventQueue[i].priority < lowestPriority) {
                    lowestPriority = eventQueue[i].priority;
                    lowestIndex = i;
                }
            }
            eventQueue.splice(lowestIndex, 1);
        }
        // "block" policy: don't drop, just don't add (handled in publish)
    }
    /**
     * Process queue (drain events)
     */
    function processQueue() {
        while (eventQueue.length > 0) {
            const event = eventQueue.shift();
            stats.queueSize = eventQueue.length;
            processEvent(event);
        }
    }
    return {
        publish(event) {
            // Update stats
            stats.published++;
            stats.byChannel[event.channelId] = (stats.byChannel[event.channelId] || 0) + 1;
            stats.byKind[event.kind] = (stats.byKind[event.kind] || 0) + 1;
            stats.byPriority[event.priority.toString()] = (stats.byPriority[event.priority.toString()] || 0) + 1;
            // Check if queue is full
            if (eventQueue.length >= maxQueueSize) {
                if (dropPolicy === "block") {
                    // Block: don't add to queue, just drop
                    stats.dropped++;
                    console.warn(`[NerveBus] Queue full, dropping event (block policy): ${event.id}`);
                    return;
                }
                else {
                    // Drop an event based on policy
                    dropEvent();
                }
            }
            // Add to queue (priority-ordered insertion)
            // Higher priority events go to front
            let inserted = false;
            for (let i = 0; i < eventQueue.length; i++) {
                if (event.priority > eventQueue[i].priority) {
                    eventQueue.splice(i, 0, event);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                eventQueue.push(event);
            }
            stats.queueSize = eventQueue.length;
            // Process queue synchronously (for now)
            // TODO: Could be async/batched in production
            processQueue();
        },
        subscribe(channelId, subscriber) {
            if (!channelSubscribers.has(channelId)) {
                channelSubscribers.set(channelId, new Set());
            }
            const subs = channelSubscribers.get(channelId);
            subs.add(subscriber);
            // Return unsubscribe function
            return () => {
                subs.delete(subscriber);
                if (subs.size === 0) {
                    channelSubscribers.delete(channelId);
                }
            };
        },
        subscribeAll(subscriber) {
            globalSubscribers.add(subscriber);
            // Return unsubscribe function
            return () => {
                globalSubscribers.delete(subscriber);
            };
        },
        registerTransport(transport) {
            transports.add(transport);
            console.info(`[NerveBus] Registered transport: ${transport.name}`);
        },
        getStats() {
            return {
                ...stats,
                queueSize: eventQueue.length,
            };
        },
        getSubscriberCount(channelId) {
            if (channelId) {
                return channelSubscribers.get(channelId)?.size || 0;
            }
            return globalSubscribers.size;
        },
    };
}
/**
 * Singleton Nerve Bus instance with production defaults
 */
export const NERVE_BUS = createInMemoryNerveBus({
    maxQueueSize: 10_000,
    dropPolicy: "drop_lowest_priority",
    defaultSampleRate: 0.1,
});
