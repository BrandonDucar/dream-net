import { EventEnvelope } from './EventEnvelope.js';

export type Middleware<T = any> = (envelope: EventEnvelope<T>, next: () => void) => void;

export interface FiberChannelConfig {
    name: string;
    priority: 'critical' | 'high' | 'normal' | 'low';
    capacity?: number; // For backpressure (future)
}

export class LaserFiberBus {
    private channels: Map<string, Set<(event: EventEnvelope) => void>> = new Map();
    private middleware: Middleware[] = [];

    // Priority queues
    private criticalQueue: EventEnvelope[] = [];
    private highQueue: EventEnvelope[] = [];
    private normalQueue: EventEnvelope[] = [];
    private lowQueue: EventEnvelope[] = [];

    // MagRail (Magnetic Rail) - High Throughput Batch Queue
    private magRailQueue: EventEnvelope[] = [];
    private readonly MAG_RAIL_BATCH_SIZE = 100;

    private isProcessing = false;

    constructor() {
        this.startProcessingLoop();
    }

    public use(middleware: Middleware) {
        this.middleware.push(middleware);
    }

    public subscribe<T>(channelName: string, handler: (event: EventEnvelope<T>) => void) {
        if (!this.channels.has(channelName)) {
            this.channels.set(channelName, new Set());
        }
        this.channels.get(channelName)!.add(handler as any);
    }

    public publish<T>(channelName: string, envelope: EventEnvelope<T>, priority: FiberChannelConfig['priority'] = 'normal', useMagRail: boolean = false) {
        if (useMagRail) {
            this.magRailQueue.push(envelope);
            return;
        }

        // Enqueue based on priority
        switch (priority) {
            case 'critical': this.criticalQueue.push(envelope); break;
            case 'high': this.highQueue.push(envelope); break;
            case 'normal': this.normalQueue.push(envelope); break;
            case 'low': this.lowQueue.push(envelope); break;
        }
    }

    private async startProcessingLoop() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        setInterval(async () => {
            await this.processQueues();
        }, 10); // 10ms "Laser" tick
    }

    private async processQueues() {
        // 1. MagRail Express (Batch Processing)
        if (this.magRailQueue.length > 0) {
            const batch = this.magRailQueue.splice(0, this.MAG_RAIL_BATCH_SIZE);
            // Process batch in parallel for speed
            await Promise.all(batch.map(env => this.dispatch(env)));
        }

        // 2. Process critical first (drain completely)
        while (this.criticalQueue.length > 0) {
            await this.dispatch(this.criticalQueue.shift()!);
        }

        // 3. Process high (up to 50 per tick)
        let highCount = 0;
        while (this.highQueue.length > 0 && highCount < 50) {
            await this.dispatch(this.highQueue.shift()!);
            highCount++;
        }

        // 4. Process normal (up to 20 per tick)
        let normalCount = 0;
        while (this.normalQueue.length > 0 && normalCount < 20) {
            await this.dispatch(this.normalQueue.shift()!);
            normalCount++;
        }

        // 5. Process low (up to 5 per tick)
        let lowCount = 0;
        while (this.lowQueue.length > 0 && lowCount < 5) {
            await this.dispatch(this.lowQueue.shift()!);
            lowCount++;
        }
    }

    private async dispatch(envelope: EventEnvelope) {
        // Run middleware chain
        let index = 0;
        const next = async () => {
            if (index < this.middleware.length) {
                const mw = this.middleware[index++];
                await mw(envelope, next);
            } else {
                // Final delivery
                this.deliver(envelope);
            }
        };
        await next();
    }

    private deliver(envelope: EventEnvelope) {
        // Deliver to specific channel listeners
        // Note: In this simplified version, we treat eventType as channel or use routing metadata
        const channel = envelope.routing?.channel || envelope.eventType;

        const handlers = this.channels.get(channel);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(envelope);
                } catch (err) {
                    console.error(`[LaserFiber] Delivery failed for ${channel}:`, err);
                }
            });
        }

        // Also deliver to global wildcard listeners if any (omitted for speed)
    }
}
