/**
 * 🏰 MemPalaceSpike
 * The Grudge Ledger for Arya Stark.
 * Subscribes to execution logs and stores them in persistent memory (Redis/NATS KV).
 */
export declare class MemPalaceSpike {
    private isConnected;
    constructor();
    private setupListeners;
    private recordGrudge;
    queryGrudges(targetUsername: string): Promise<never[]>;
}
export declare const memPalaceSpike: MemPalaceSpike;
//# sourceMappingURL=MemPalaceSpike.d.ts.map