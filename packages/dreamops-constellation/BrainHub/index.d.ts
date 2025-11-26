/**
 * BrainHub - Intelligence Star
 *
 * Ingest data, plan tasks, route work, generate specs/briefs
 * APIs: Cursor Tasks API, GitHub Issues/Projects
 *
 * Immune System Integration:
 * - Self vs Non-Self Detection
 * - Anomaly Detection
 * - Threat Recognition
 */
import SelfBaseline from "./selfBaseline.js";
import NonSelfDetector from "./nonSelfDetector.js";
import DetectorGenerator from "./detectorGenerator.js";
import type DreamMemory from "../DreamMemory/index.js";
export interface DevBrief {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
    priority: "low" | "medium" | "high" | "critical";
    estimatedHours: number;
    contextPack?: string;
    createdAt: string;
}
export interface ContentBrief {
    id: string;
    title: string;
    description: string;
    platforms: string[];
    targetAudience: string;
    tone: string;
    mediaRequirements?: string[];
    scheduledFor?: string;
    createdAt: string;
}
export interface DeployOrder {
    id: string;
    service: string;
    environment: "staging" | "prod";
    branch: string;
    priority: "low" | "medium" | "high" | "critical";
    metadata?: Record<string, any>;
    createdAt: string;
}
export interface Task {
    id: string;
    description: string;
    type: "code" | "test" | "deploy" | "document" | "other";
    assignedTo?: string;
    status: "pending" | "in-progress" | "completed" | "blocked";
}
export declare class BrainHub {
    private tasks;
    private selfBaseline;
    private nonSelfDetector;
    private detectorGenerator;
    constructor(dreamMemory?: DreamMemory);
    /**
     * Ingest data from various sources
     */
    ingestData(sources: {
        prompts?: string[];
        events?: any[];
        repoSignals?: any[];
        deploymentStatus?: any;
        socialMetrics?: any;
    }): Promise<void>;
    /**
     * Break goals into tasks and choose tools/agents
     */
    planTasks(goal: string): Promise<Task[]>;
    /**
     * Generate a Dev Brief for Cursor
     */
    generateDevBrief(title: string, description: string, contextPack?: string): Promise<DevBrief>;
    /**
     * Generate a Content Brief for SocialWeaver
     */
    generateContentBrief(title: string, description: string, platforms: string[], targetAudience: string, tone: string): Promise<ContentBrief>;
    /**
     * Generate a Deployment Order for DeployKeeper
     */
    generateDeployOrder(service: string, environment: "staging" | "prod", branch: string, priority?: "low" | "medium" | "high" | "critical"): Promise<DeployOrder>;
    /**
     * Route work to appropriate star
     */
    routeWork(workItem: DevBrief | ContentBrief | DeployOrder): Promise<{
        star: string;
        action: string;
    }>;
    /**
     * Get all briefs/orders
     */
    getAllTasks(): Array<DevBrief | ContentBrief | DeployOrder>;
    /**
     * Get a specific task by ID
     */
    getTask(id: string): DevBrief | ContentBrief | DeployOrder | undefined;
    /**
     * Get self baseline system
     */
    getSelfBaseline(): SelfBaseline | undefined;
    /**
     * Get non-self detector
     */
    getNonSelfDetector(): NonSelfDetector | undefined;
    /**
     * Get detector generator
     */
    getDetectorGenerator(): DetectorGenerator | undefined;
}
export default BrainHub;
