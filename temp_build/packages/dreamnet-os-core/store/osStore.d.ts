import type { DreamNetOSStatus, DreamNetOSSnapshot } from "../types";
export declare const OSStore: {
    setSnapshot(snapshot: DreamNetOSSnapshot): void;
    setLastRunAt(ts: number | null): void;
    getStatus(): DreamNetOSStatus;
};
