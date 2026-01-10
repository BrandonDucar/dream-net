import type { WolfContext, WolfSignal } from '../types.js';
export interface WolfStrikeResult {
    signalId: string;
    targetId?: string;
    actionTaken: string;
    succeeded: boolean;
    meta?: Record<string, any>;
}
export declare function performPackStrikes(ctx: WolfContext, signals: WolfSignal[]): WolfStrikeResult[];
//# sourceMappingURL=strikeStrategy.d.ts.map