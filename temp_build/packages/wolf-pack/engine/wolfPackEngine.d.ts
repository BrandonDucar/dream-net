import type { WolfContext, WolfPackStatus, WolfSignal } from "../types";
import { type WolfStrikeResult } from "../strategies/strikeStrategy";
export declare function runWolfPackCycle(ctx: WolfContext): {
    signals: WolfSignal[];
    strikes: WolfStrikeResult[];
};
export declare function wolfPackStatus(): WolfPackStatus;
