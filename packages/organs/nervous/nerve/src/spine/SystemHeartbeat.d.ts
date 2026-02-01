import { DreamEventBus } from './dreamnet-event-bus/index.js';
export declare class SystemHeartbeat {
    private eventBus;
    private intervalId;
    private isRunning;
    constructor(eventBus: DreamEventBus);
    start(intervalMs?: number): void;
    stop(): void;
    private pulse;
}
//# sourceMappingURL=SystemHeartbeat.d.ts.map