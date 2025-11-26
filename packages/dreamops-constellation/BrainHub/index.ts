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
  contextPack?: string; // Link to DreamMemory context pack
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

export class BrainHub {
  private tasks: Map<string, DevBrief | ContentBrief | DeployOrder> = new Map();
  private selfBaseline: SelfBaseline;
  private nonSelfDetector: NonSelfDetector;
  private detectorGenerator: DetectorGenerator;

  constructor(dreamMemory?: DreamMemory) {
    // Initialize immune system components
    if (dreamMemory) {
      this.selfBaseline = new SelfBaseline(dreamMemory);
      this.nonSelfDetector = new NonSelfDetector(this.selfBaseline);
      this.detectorGenerator = new DetectorGenerator(this.selfBaseline);
    }
  }

  /**
   * Ingest data from various sources
   */
  async ingestData(sources: {
    prompts?: string[];
    events?: any[];
    repoSignals?: any[];
    deploymentStatus?: any;
    socialMetrics?: any;
  }): Promise<void> {
    // TODO: Implement data ingestion logic
    console.log("[BrainHub] Ingesting data from sources:", Object.keys(sources));
    
    // Update baselines with new data
    if (this.selfBaseline && sources.deploymentStatus) {
      // Extract metrics and update baselines
      // This is a placeholder - would extract actual metrics from deploymentStatus
    }
  }

  /**
   * Break goals into tasks and choose tools/agents
   */
  async planTasks(goal: string): Promise<Task[]> {
    // TODO: Implement task planning logic
    console.log("[BrainHub] Planning tasks for goal:", goal);
    return [];
  }

  /**
   * Generate a Dev Brief for Cursor
   */
  async generateDevBrief(
    title: string,
    description: string,
    contextPack?: string
  ): Promise<DevBrief> {
    const brief: DevBrief = {
      id: `dev-${Date.now()}`,
      title,
      description,
      tasks: [],
      priority: "medium",
      estimatedHours: 0,
      contextPack,
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(brief.id, brief);
    return brief;
  }

  /**
   * Generate a Content Brief for SocialWeaver
   */
  async generateContentBrief(
    title: string,
    description: string,
    platforms: string[],
    targetAudience: string,
    tone: string
  ): Promise<ContentBrief> {
    const brief: ContentBrief = {
      id: `content-${Date.now()}`,
      title,
      description,
      platforms,
      targetAudience,
      tone,
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(brief.id, brief);
    return brief;
  }

  /**
   * Generate a Deployment Order for DeployKeeper
   */
  async generateDeployOrder(
    service: string,
    environment: "staging" | "prod",
    branch: string,
    priority: "low" | "medium" | "high" | "critical" = "medium"
  ): Promise<DeployOrder> {
    const order: DeployOrder = {
      id: `deploy-${Date.now()}`,
      service,
      environment,
      branch,
      priority,
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(order.id, order);
    return order;
  }

  /**
   * Route work to appropriate star
   */
  async routeWork(
    workItem: DevBrief | ContentBrief | DeployOrder
  ): Promise<{ star: string; action: string }> {
    if ("service" in workItem) {
      return { star: "DeployKeeper", action: "deploy" };
    } else if ("platforms" in workItem) {
      return { star: "SocialWeaver", action: "schedule" };
    } else {
      return { star: "Cursor", action: "execute" };
    }
  }

  /**
   * Get all briefs/orders
   */
  getAllTasks(): Array<DevBrief | ContentBrief | DeployOrder> {
    return Array.from(this.tasks.values());
  }

  /**
   * Get a specific task by ID
   */
  getTask(id: string): DevBrief | ContentBrief | DeployOrder | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get self baseline system
   */
  getSelfBaseline(): SelfBaseline | undefined {
    return this.selfBaseline;
  }

  /**
   * Get non-self detector
   */
  getNonSelfDetector(): NonSelfDetector | undefined {
    return this.nonSelfDetector;
  }

  /**
   * Get detector generator
   */
  getDetectorGenerator(): DetectorGenerator | undefined {
    return this.detectorGenerator;
  }
}

export default BrainHub;

