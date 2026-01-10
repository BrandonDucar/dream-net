import type { DreamNetOSStatus, DreamNetOSSnapshot } from '../types.js';
export declare const OSStore: {
    setSnapshot(snapshot: DreamNetOSSnapshot): void;
    setLastRunAt(ts: number | null): void;
    getStatus(): DreamNetOSStatus;
};
//# sourceMappingURL=osStore.d.ts.map