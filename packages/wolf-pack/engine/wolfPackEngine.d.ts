import type { WolfContext, WolfPackStatus, WolfSignal } from '../types.js';
import { type WolfStrikeResult } from '../strategies/strikeStrategy.js';
export declare function runWolfPackCycle(ctx: WolfContext): {
    signals: WolfSignal[];
    strikes: WolfStrikeResult[];
};
export declare function wolfPackStatus(): WolfPackStatus;
