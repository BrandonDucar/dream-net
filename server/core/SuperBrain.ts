/**
 * 🧠 DreamNet Super Brain
 * 
 * The autonomous orchestration layer that:
 * - Watches all events
 * - Makes autonomous decisions
 * - Remembers everything
 * - Connects all systems
 * - Enables AI assistants to query and use DreamNet's knowledge
 * 
 * Components:
 * - Event Watcher: Watch all events and queue for processing
 * - Decision Engine: Make autonomous decisions about what to do
 * - Action Executor: Execute decisions
 * - Brain Store: Persistent memory for long-term context
 * - Cursor Integration: Enable AI assistants to query and act
 */

import { driveEngine, type DriveAction, type DriveFeedback } from "./DriveEngine";
import { StarbridgeTopic, type StarbridgeEvent } from "../starbridge/types";
import { dreamVault } from "../dream-vault/DreamVault";
import { dreamNetEmail } from "../email/DreamNetEmail";
import { wolfPack } from "../agents/WolfPack";

export interface BrainDecision {
  decisionId: string;
  eventId?: string;
  actionId?: string;
  packId?: string;
  decision: "proceed" | "hold" | "abort" | "escalate";
  confidence: number; // 0-1
  reasoning: string;
  context: Record<string, any>;
  riskScore: number; // 0-100
  requiresApproval: boolean;
  timestamp: number;
}

export interface BrainAction {
  actionId: string;
  decisionId: string;
  actionType: "email" | "memory" | "agent" | "workflow" | "cursor";
  target: string;
  params: Record<string, any>;
  priority: number;
  status: "pending" | "executing" | "completed" | "failed";
  result?: any;
  error?: string;
  executedAt?: number;
}

export interface BrainContext {
  contextId: string;
  topic: string;
  relatedDecisions: string[];
  relatedActions: string[];
  patterns: string[];
  recommendations: string[];
  timestamp: number;
}

export interface BrainQuery {
  queryId: string;
  question: string;
  context?: Record<string, any>;
  timestamp: number;
}

export interface BrainResponse {
  queryId: string;
  answer: string;
  confidence: number;
  context: BrainContext;
  recommendations: string[];
  relatedDecisions: BrainDecision[];
  relatedActions: BrainAction[];
}

export class SuperBrain {
  private eventQueue: StarbridgeEvent[] = [];
  private decisions: Map<string, BrainDecision> = new Map();
  private actions: Map<string, BrainAction> = new Map();
  private contexts: Map<string, BrainContext> = new Map();
  private queries: Map<string, BrainQuery> = new Map();
  private isWatching: boolean = false;
  private eventWatcherInterval?: NodeJS.Timeout;

  constructor() {
    console.log("🧠 [Super Brain] Initializing...");
  }

  /**
   * Start watching events
   */
  startWatching(): void {
    if (this.isWatching) {
      console.warn("🧠 [Super Brain] Already watching events");
      return;
    }

    this.isWatching = true;
    console.log("🧠 [Super Brain] Started watching events");

    // In a real implementation, this would subscribe to Starbridge event stream
    // For now, we'll simulate with periodic checks
    this.eventWatcherInterval = setInterval(() => {
      this.processEventQueue();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop watching events
   */
  stopWatching(): void {
    if (!this.isWatching) return;

    this.isWatching = false;
    if (this.eventWatcherInterval) {
      clearInterval(this.eventWatcherInterval);
      this.eventWatcherInterval = undefined;
    }

    console.log("🧠 [Super Brain] Stopped watching events");
  }

  /**
   * Add event to queue (called by Event Watcher)
   */
  addEvent(event: StarbridgeEvent): void {
    this.eventQueue.push(event);
    console.log(`🧠 [Super Brain] Event queued: ${event.type} from ${event.source}`);
  }

  /**
   * Process event queue
   */
  private async processEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const event = this.eventQueue.shift();
    if (!event) return;

    console.log(`🧠 [Super Brain] Processing event: ${event.type}`);

    // Make decision about this event
    const decision = await this.makeDecision(event);

    // Execute action if decision is to proceed
    if (decision.decision === "proceed") {
      const action = await this.generateAction(decision);
      if (action) {
        await this.executeAction(action);
      }
    }

    // Store decision in Brain Store
    await this.storeDecision(decision);
  }

  /**
   * Make decision about an event
   */
  private async makeDecision(event: StarbridgeEvent): Promise<BrainDecision> {
    const decisionId = `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Gather context
    const context = await this.gatherContext(event);

    // Evaluate decision
    let decision: "proceed" | "hold" | "abort" | "escalate" = "hold";
    let confidence = 0.5;
    let reasoning = "";
    let riskScore = 50;
    let requiresApproval = false;

    // Decision logic based on event type
    if (event.type === "wolf_pack.opportunity_found") {
      // Wolf Pack found opportunity → Decide if we should pursue
      const opportunity = event.payload?.opportunity;
      if (opportunity) {
        decision = "proceed";
        confidence = 0.8;
        reasoning = "High-value opportunity found, proceeding with application";
        riskScore = 20; // Low risk
        requiresApproval = false;
      }
    } else if (event.type === "gpt.output_generated") {
      // GPT generated output → Decide if we should store in memory
      decision = "proceed";
      confidence = 0.9;
      reasoning = "GPT output should be stored in memory for future reference";
      riskScore = 10; // Very low risk
      requiresApproval = false;
    } else if (event.type === "dream.created") {
      // Dream created → Decide if we should notify agents
      decision = "proceed";
      confidence = 0.7;
      reasoning = "New dream created, notifying relevant agents";
      riskScore = 15; // Low risk
      requiresApproval = false;
    } else if (event.type === "system.error") {
      // System error → Decide if we should escalate
      const severity = event.payload?.severity || "medium";
      if (severity === "high" || severity === "critical") {
        decision = "escalate";
        confidence = 0.9;
        reasoning = "Critical error detected, escalating to administrators";
        riskScore = 90; // High risk
        requiresApproval = true;
      } else {
        decision = "proceed";
        confidence = 0.6;
        reasoning = "Error logged, monitoring for resolution";
        riskScore = 30; // Medium risk
        requiresApproval = false;
      }
    }

    const brainDecision: BrainDecision = {
      decisionId,
      eventId: event.id,
      decision,
      confidence,
      reasoning,
      context,
      riskScore,
      requiresApproval,
      timestamp: Date.now(),
    };

    this.decisions.set(decisionId, brainDecision);
    return brainDecision;
  }

  /**
   * Gather context for decision
   */
  private async gatherContext(event: StarbridgeEvent): Promise<Record<string, any>> {
    const context: Record<string, any> = {
      eventType: event.type,
      eventSource: event.source,
      eventPayload: event.payload,
      timestamp: event.ts,
    };

    // Get related decisions
    const relatedDecisions = Array.from(this.decisions.values())
      .filter((d) => d.eventId === event.id || d.context?.eventType === event.type)
      .slice(0, 5);

    context.relatedDecisions = relatedDecisions.map((d) => d.decisionId);

    // Get drive status for relevant packs
    if (event.source === "WolfPack" || event.type.includes("wolf")) {
      const driveStatus = driveEngine.getDriveStatus();
      context.driveStatus = driveStatus["wolf-pack"];
    }

    // Get patterns from Brain Store
    // In a real implementation, this would query DreamVault for patterns
    context.patterns = [];

    return context;
  }

  /**
   * Generate action from decision
   */
  private async generateAction(decision: BrainDecision): Promise<BrainAction | null> {
    if (decision.decision !== "proceed") return null;

    const actionId = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let actionType: "email" | "memory" | "agent" | "workflow" | "cursor" = "memory";
    let target = "";
    let params: Record<string, any> = {};

    // Generate action based on event type
    if (decision.context.eventType === "wolf_pack.opportunity_found") {
      // Send email application
      actionType = "email";
      target = "wolf_pack_application";
      params = {
        opportunity: decision.context.eventPayload?.opportunity,
        template: "base-builder-grant",
      };
    } else if (decision.context.eventType === "gpt.output_generated") {
      // Store in memory
      actionType = "memory";
      target = "dream_vault";
      params = {
        title: decision.context.eventPayload?.title || "GPT Output",
        content: decision.context.eventPayload?.content || "",
        type: "gpt_output",
        source: decision.context.eventSource,
      };
    } else if (decision.context.eventType === "dream.created") {
      // Notify agents
      actionType = "agent";
      target = "lucid_agent";
      params = {
        dream: decision.context.eventPayload?.dream,
        action: "process_new_dream",
      };
    }

    const action: BrainAction = {
      actionId,
      decisionId: decision.decisionId,
      actionType,
      target,
      params,
      priority: decision.confidence,
      status: "pending",
    };

    this.actions.set(actionId, action);
    return action;
  }

  /**
   * Execute action
   */
  private async executeAction(action: BrainAction): Promise<void> {
    action.status = "executing";
    action.executedAt = Date.now();

    try {
      console.log(`🧠 [Super Brain] Executing action: ${action.actionType} → ${action.target}`);

      if (action.actionType === "email") {
        // Execute email action
        if (action.target === "wolf_pack_application") {
          const opportunity = action.params.opportunity;
          if (opportunity) {
            // Send email via DreamNetEmail
            // await dreamNetEmail.send(...);
            console.log(`🧠 [Super Brain] Would send email for opportunity: ${opportunity.name}`);
          }
        }
      } else if (action.actionType === "memory") {
        // Store in DreamVault
        if (action.target === "dream_vault") {
          // await dreamVault.createDream(...);
          console.log(`🧠 [Super Brain] Would store in DreamVault: ${action.params.title}`);
        }
      } else if (action.actionType === "agent") {
        // Trigger agent action
        if (action.target === "lucid_agent") {
          // await triggerAgent(...);
          console.log(`🧠 [Super Brain] Would trigger agent: ${action.target}`);
        }
      }

      action.status = "completed";
      action.result = { success: true };

      // Record feedback to Drive Engine
      if (action.params.packId) {
        const feedback: DriveFeedback = {
          actionId: action.actionId,
          packId: action.params.packId,
          outcome: "success",
          result: action.result,
        };
        driveEngine.processFeedback(feedback);
      }
    } catch (error: any) {
      action.status = "failed";
      action.error = error.message;
      console.error(`🧠 [Super Brain] Action failed: ${error.message}`);

      // Record feedback to Drive Engine
      if (action.params.packId) {
        const feedback: DriveFeedback = {
          actionId: action.actionId,
          packId: action.params.packId,
          outcome: "failure",
          result: { error: error.message },
        };
        driveEngine.processFeedback(feedback);
      }
    }
  }

  /**
   * Store decision in Brain Store (DreamVault)
   */
  private async storeDecision(decision: BrainDecision): Promise<void> {
    try {
      // Store decision as a "dream" in DreamVault for long-term memory
      // await dreamVault.createDream({
      //   title: `Brain Decision: ${decision.decision}`,
      //   content: decision.reasoning,
      //   type: "brain_decision",
      //   metadata: {
      //     decisionId: decision.decisionId,
      //     confidence: decision.confidence,
      //     riskScore: decision.riskScore,
      //     context: decision.context,
      //   },
      // });

      console.log(`🧠 [Super Brain] Decision stored: ${decision.decisionId}`);
    } catch (error: any) {
      console.error(`🧠 [Super Brain] Failed to store decision: ${error.message}`);
    }
  }

  /**
   * Query Brain (for AI assistants like Cursor)
   */
  async query(query: BrainQuery): Promise<BrainResponse> {
    console.log(`🧠 [Super Brain] Query received: ${query.question}`);

    // Store query
    this.queries.set(query.queryId, query);

    // Gather context
    const context = await this.gatherContextForQuery(query);

    // Generate answer
    const answer = await this.generateAnswer(query, context);

    // Get recommendations
    const recommendations = await this.generateRecommendations(query, context);

    // Get related decisions and actions
    const relatedDecisions = Array.from(this.decisions.values())
      .filter((d) => this.isRelevant(d, query))
      .slice(0, 5);

    const relatedActions = Array.from(this.actions.values())
      .filter((a) => this.isRelevant(a, query))
      .slice(0, 5);

    const response: BrainResponse = {
      queryId: query.queryId,
      answer,
      confidence: 0.8, // Could be calculated based on context completeness
      context,
      recommendations,
      relatedDecisions,
      relatedActions,
    };

    return response;
  }

  /**
   * Gather context for query
   */
  private async gatherContextForQuery(query: BrainQuery): Promise<BrainContext> {
    const contextId = `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Find related decisions
    const relatedDecisions = Array.from(this.decisions.values())
      .filter((d) => this.isRelevant(d, query))
      .map((d) => d.decisionId);

    // Find related actions
    const relatedActions = Array.from(this.actions.values())
      .filter((a) => this.isRelevant(a, query))
      .map((a) => a.actionId);

    // Extract patterns (simplified)
    const patterns: string[] = [];
    if (relatedDecisions.length > 0) {
      patterns.push("Similar decisions have been made before");
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (query.question.includes("opportunity") || query.question.includes("funding")) {
      recommendations.push("Check Wolf Pack drive status");
      recommendations.push("Review similar opportunities");
    }

    const context: BrainContext = {
      contextId,
      topic: this.extractTopic(query.question),
      relatedDecisions,
      relatedActions,
      patterns,
      recommendations,
      timestamp: Date.now(),
    };

    this.contexts.set(contextId, context);
    return context;
  }

  /**
   * Generate answer to query
   */
  private async generateAnswer(query: BrainQuery, context: BrainContext): Promise<string> {
    // Simplified answer generation
    // In a real implementation, this would use LLM or pattern matching

    if (query.question.includes("opportunity") || query.question.includes("funding")) {
      const driveStatus = driveEngine.getDriveStatus();
      const wolfPackDrive = driveStatus["wolf-pack"];
      return `Wolf Pack is currently ${wolfPackDrive.hungerLevel > 0.7 ? "very hungry" : "moderately hungry"} for opportunities. ` +
        `Momentum is ${wolfPackDrive.momentum > 0.7 ? "high" : "moderate"}. ` +
        `Success rate is ${(wolfPackDrive.successRate * 100).toFixed(0)}%. ` +
        `Based on ${context.relatedDecisions.length} similar decisions, I recommend proceeding with the opportunity.`;
    }

    return "I need more context to provide a specific answer. Please provide more details about what you're looking for.";
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(query: BrainQuery, context: BrainContext): Promise<string[]> {
    return context.recommendations;
  }

  /**
   * Check if decision/action is relevant to query
   */
  private isRelevant(item: BrainDecision | BrainAction, query: BrainQuery): boolean {
    const question = query.question.toLowerCase();
    const reasoning = "reasoning" in item ? item.reasoning.toLowerCase() : "";
    const target = "target" in item ? item.target.toLowerCase() : "";

    // Simple keyword matching (could be improved with semantic search)
    const keywords = question.split(" ");
    return keywords.some((keyword) => reasoning.includes(keyword) || target.includes(keyword));
  }

  /**
   * Extract topic from question
   */
  private extractTopic(question: string): string {
    const lower = question.toLowerCase();
    if (lower.includes("opportunity") || lower.includes("funding")) return "funding";
    if (lower.includes("dream")) return "dreams";
    if (lower.includes("agent")) return "agents";
    if (lower.includes("email")) return "communication";
    return "general";
  }

  /**
   * Get Brain status
   */
  getStatus(): {
    isWatching: boolean;
    eventQueueLength: number;
    decisionsCount: number;
    actionsCount: number;
    contextsCount: number;
    queriesCount: number;
  } {
    return {
      isWatching: this.isWatching,
      eventQueueLength: this.eventQueue.length,
      decisionsCount: this.decisions.size,
      actionsCount: this.actions.size,
      contextsCount: this.contexts.size,
      queriesCount: this.queries.size,
    };
  }
}

// Singleton instance
export const superBrain = new SuperBrain();

