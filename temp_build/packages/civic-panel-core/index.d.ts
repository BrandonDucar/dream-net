import type { CommandType, CivicCommand, CivicPanelContext, CivicDashboardSnapshot, CivicPanelStatus } from "./types";
export declare const CivicPanelCore: {
    run(context: CivicPanelContext): Promise<CivicPanelStatus>;
    status(): CivicPanelStatus;
    getDashboardSnapshot(): CivicDashboardSnapshot;
    enqueueCommand(type: CommandType, label?: string, meta?: Record<string, any>): CivicCommand;
};
export * from "./types";
export default CivicPanelCore;
