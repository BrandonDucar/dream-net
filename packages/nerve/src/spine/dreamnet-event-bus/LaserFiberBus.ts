import { EventEnvelope } from './EventEnvelope.js';
import { zkSynapseVerifier } from '../security/zkSynapseVerifier.js';
import { epigenetics } from '@dreamnet/memory-dna';

export type Middleware<T = any> = (envelope: EventEnvelope<T>, next: () => void) => void;

/**
 * 🧬 Epigenetic Quarantine Middleware
 * Role: Instantly sheds pulses from sources marked with high trauma.
 */
export const epigeneticQuarantine: Middleware = (envelope: EventEnvelope, next: () => void) => {
    const quarantinedHashes = epigenetics.getQuarantinedHashes();

    // Check if source or a specific metadata tag matches a quarantine hash
    const sourceHash = Buffer.from(envelope.source).toString('hex').slice(0, 16);

    if (quarantinedHashes.includes(sourceHash)) {
        console.warn(`[🧬 Quarantine] SHEDDING PULSE: Source ${envelope.source} (${sourceHash}) is under epigenetic lockdown.`);
        return; // Shed the pulse
    }

    next();
};

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
    private metabolicPressure = 0; // 0-100 scale

    constructor() {
        this.use(zkSynapseVerifier);
        this.use(epigeneticQuarantine);
        this.startProcessingLoop();
    }

    /**
     * 🌀 SET METABOLIC PRESSURE
     * High pressure (spike) triggers task shedding of normal/low priority queues.
     */
    public setMetabolicPressure(score: number) {
        this.metabolicPressure = Math.min(100, Math.max(0, score));
        if (this.metabolicPressure > 80) {
            console.warn(`[🌀 MetabolicCortex] HIGH PRESSURE DETECTED (${this.metabolicPressure}%). Initiating protective task shedding.`);
        }
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

        // 4. Process normal (up to 20 per tick, shed if pressure > 70)
        let normalCount = 0;
        const normalThreshold = this.metabolicPressure > 70 ? 0 : 20;
        while (this.normalQueue.length > 0 && normalCount < normalThreshold) {
            await this.dispatch(this.normalQueue.shift()!);
            normalCount++;
        }
        if (this.metabolicPressure > 70 && this.normalQueue.length > 0) {
            const dropped = this.normalQueue.splice(0, 10); // Shed in chunks
            if (dropped.length > 0) console.log(`[🌀 MetabolicCortex] SHED: Dropped ${dropped.length} normal events due to pressure.`);
        }

        // 5. Process low (up to 5 per tick, shed if pressure > 40)
        let lowCount = 0;
        const lowThreshold = this.metabolicPressure > 40 ? 0 : 5;
        while (this.lowQueue.length > 0 && lowCount < lowThreshold) {
            await this.dispatch(this.lowQueue.shift()!);
            lowCount++;
        }
        if (this.metabolicPressure > 40 && this.lowQueue.length > 0) {
            const dropped = this.lowQueue.splice(0, 5);
            if (dropped.length > 0) console.log(`[🌀 MetabolicCortex] SHED: Dropped ${dropped.length} low priority events due to pressure.`);
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
