import type { CommandType, CivicCommand, CivicPanelContext, CivicDashboardSnapshot, CivicPanelStatus } from './types.js';
export declare const CivicPanelCore: {
    run(context: CivicPanelContext): Promise<CivicPanelStatus>;
    status(): CivicPanelStatus;
    getDashboardSnapshot(): CivicDashboardSnapshot;
    enqueueCommand(type: CommandType, label?: string, meta?: Record<string, any>): CivicCommand;
};
export * from './types.js';
export default CivicPanelCore;
//# sourceMappingURL=index.d.ts.map