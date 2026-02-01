import { EventEnvelope } from './EventEnvelope.js';
export type Middleware<T = any> = (envelope: EventEnvelope<T>, next: () => void) => void;
/**
 * 🧬 Epigenetic Quarantine Middleware
 * Role: Instantly sheds pulses from sources marked with high trauma.
 */
export declare const epigeneticQuarantine: Middleware;
export interface FiberChannelConfig {
    name: string;
    priority: 'critical' | 'high' | 'normal' | 'low';
    capacity?: number;
}
export declare class LaserFiberBus {
    private channels;
    private middleware;
    private criticalQueue;
    private highQueue;
    private normalQueue;
    private lowQueue;
    private magRailQueue;
    private readonly MAG_RAIL_BATCH_SIZE;
    private isProcessing;
    private metabolicPressure;
    constructor();
    /**
     * 🌀 SET METABOLIC PRESSURE
     * High pressure (spike) triggers task shedding of normal/low priority queues.
     */
    setMetabolicPressure(score: number): void;
    use(middleware: Middleware): void;
    subscribe<T>(channelName: string, handler: (event: EventEnvelope<T>) => void): void;
    publish<T>(channelName: string, envelope: EventEnvelope<T>, priority?: FiberChannelConfig['priority'], useMagRail?: boolean): void;
    private startProcessingLoop;
    private processQueues;
    private dispatch;
    private deliver;
}
//# sourceMappingURL=LaserFiberBus.d.ts.map