export type WidgetKind = "metric-card" | "table" | "log" | "graph" | "status-grid";
export interface WidgetMetric {
    label: string;
    value: number | string;
    unit?: string;
    hint?: string;
}
export interface WidgetConfig {
    id: string;
    kind: WidgetKind;
    title: string;
    description?: string;
    metrics?: WidgetMetric[];
    payload?: any;
    updatedAt: number;
}
export type CommandType = "refresh-vault" | "refresh-fields" | "refresh-reputation" | "refresh-dreamcortex" | "refresh-dreamshop" | "refresh-dreambet" | "refresh-zen" | "noop";
export type CommandState = "queued" | "running" | "completed" | "failed";
export interface CivicCommand {
    id: string;
    type: CommandType;
    label?: string;
    createdAt: number;
    updatedAt: number;
    state: CommandState;
    meta?: Record<string, any>;
}
export interface CivicPanelContext {
    dreamVault?: any;
    dreamShop?: any;
    fieldLayer?: any;
    dreamBetCore?: any;
    zenGardenCore?: any;
    dreamCortex?: any;
    reputationLattice?: any;
    narrativeField?: any;
    identityGrid?: any;
    economicEngineCore?: any;
    neuralMesh?: any;
    wolfPackFundingCore?: any;
    wolfPackAnalystCore?: any;
}
export interface CivicDashboardSnapshot {
    generatedAt: number;
    widgets: WidgetConfig[];
    recentCommands: CivicCommand[];
}
export interface CivicPanelStatus {
    lastRunAt: number | null;
    widgetCount: number;
    commandCount: number;
    snapshot: CivicDashboardSnapshot;
}
//# sourceMappingURL=types.d.ts.map