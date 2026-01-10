export type DreamStatus = "idle" | "incubating" | "active" | "blocked" | "completed" | "infected";
export type DreamPriority = "low" | "normal" | "high" | "critical";
export interface DreamNode {
    id: string;
    name: string;
    description?: string;
    status: DreamStatus;
    priority: DreamPriority;
    tags?: string[];
    createdAt: number;
    updatedAt: number;
    score?: number;
    dependencies?: string[];
}
export interface CortexDirective {
    id: string;
    dreamId: string;
    intent: "stabilize" | "accelerate" | "unblock" | "monitor" | "deprecate";
    confidence: number;
    reason: string;
    createdAt: number;
    meta?: Record<string, any>;
}
export interface CortexContext {
    neuralMesh?: any;
    quantumAnticipation?: any;
    slugTime?: any;
    wolfPack?: any;
    starBridge?: any;
}
export interface CortexStatus {
    lastRunAt: number | null;
    dreamCount: number;
    directiveCount: number;
    lastDirectives: CortexDirective[];
}
