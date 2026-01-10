import type { AnalyzerResult, DispatchResult, HaloCycleResult, HaloStatus, SquadTask, WeakPoint } from "./types";
export declare class HaloEngine {
    private lastCycle;
    private weakPoints;
    private running;
    private pendingTriggerNames;
    analyzeState(mode?: "light" | "full"): Promise<AnalyzerResult[]>;
    detectWeakPoints(analysis: AnalyzerResult[]): WeakPoint[];
    generateTasks(analysis: AnalyzerResult[], mode?: "light" | "full"): SquadTask[];
    private resolveStrategy;
    dispatchToSquads(tasks: SquadTask[]): Promise<DispatchResult[]>;
    recordResults(result: HaloCycleResult): Promise<void>;
    getWeakPoints(): WeakPoint[];
    getStatus(): Promise<HaloStatus>;
    getHistory(limit?: number): Promise<HaloCycleResult[]>;
    runCycle(trigger?: string, context?: Record<string, unknown>, mode?: "light" | "full"): Promise<HaloCycleResult>;
    private buildSummary;
    private createEmptyCycle;
}
export declare const haloEngine: HaloEngine;
