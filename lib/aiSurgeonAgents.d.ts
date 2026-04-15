export interface SurgeonTask {
    dreamId: string;
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    resolved?: boolean;
    fixApplied?: string;
}
export declare const SurgeonAgent: {
    id: string;
    name: string;
    status: "active" | "idle" | "maintenance";
    taskQueue: SurgeonTask[];
    diagnosticsRun: number;
    autoFixesApplied: number;
    lastSweep: string | null;
    init: () => void;
    scheduleSweep: () => void;
    runDiagnosticSweep: () => void;
    autoFix: () => void;
    applyFix: (task: SurgeonTask) => string;
    getStatus: () => {
        id: string;
        name: string;
        status: "active" | "idle" | "maintenance";
        diagnosticsRun: number;
        autoFixesApplied: number;
        lastSweep: string;
        activeIssues: number;
        totalIssues: number;
        taskQueue: SurgeonTask[];
    };
    manualFix: (dreamId: string, issueDescription: string) => void;
    emergencyStop: () => void;
    resume: () => void;
    scheduleDreamAnalysis: (event: any) => void;
};
