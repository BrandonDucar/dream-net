import type { WolfSignal } from "../types";
export declare const TargetTracker: {
    trackFromSignals(signals: WolfSignal[]): void;
    listTargets(): string[];
    clearTarget(targetId: string): void;
    clearAll(): void;
};
