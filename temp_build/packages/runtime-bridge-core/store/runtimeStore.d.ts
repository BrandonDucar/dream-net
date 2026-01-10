import { RuntimeBridgeStatus } from "../types";
export declare const RuntimeStore: {
    markInitialized(): void;
    isInitialized(): boolean;
    updateCycleInfo(opts: {
        finishedAt: number;
        durationMs: number;
        error?: string;
    }): void;
    updateOSStatus(osStatus: any): void;
    updateCivicStatus(civicStatus: any): void;
    updateEconStatus(econStatus: any): void;
    getStatus(): RuntimeBridgeStatus;
};
