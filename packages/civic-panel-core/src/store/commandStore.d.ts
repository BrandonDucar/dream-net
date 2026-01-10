import type { CivicCommand, CivicPanelStatus, CivicDashboardSnapshot } from '../types.js';
export declare const CommandStore: {
    enqueue(cmd: Omit<CivicCommand, "createdAt" | "updatedAt" | "state">): CivicCommand;
    updateCommandState(id: string, state: CivicCommand["state"], meta?: Record<string, any>): void;
    listRecentCommands(limit?: number): CivicCommand[];
    setLastRunAt(ts: number | null): void;
    setSnapshot(snapshot: CivicDashboardSnapshot): void;
    status(): CivicPanelStatus;
};
//# sourceMappingURL=commandStore.d.ts.map