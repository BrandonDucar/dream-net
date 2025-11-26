/**
 * DreamNet Control Core
 * The executive nervous system and control panel of DreamNet
 */

import type {
  OverviewSnapshot,
  ConsciousnessSnapshot,
  GovernanceSnapshot,
  ActionCandidate,
  LawEvaluationResult,
  EventCandidate,
  OrganStatus,
  FocusArea,
  ReasonDecision,
  ReflexEvent,
  PerceptionSource,
} from "./types.js";
import {
  loadCoreValues,
  loadDivineLaws,
  loadConstraints,
  loadRights,
  loadBalanceRules,
  loadIdentity,
} from "./loaders.js";

/**
 * Control Core Interface
 */
export interface IControlCore {
  getOverviewSnapshot(): Promise<OverviewSnapshot>;
  getConsciousnessSnapshot(): Promise<ConsciousnessSnapshot>;
  getGovernanceSnapshot(): Promise<GovernanceSnapshot>;
  evaluateActionAgainstLaws(input: ActionCandidate): LawEvaluationResult;
  classifyEventPath(input: EventCandidate): "REFLEX" | "REASON";
}

/**
 * Control Core Implementation
 */
export class ControlCore implements IControlCore {
  private coreValues = loadCoreValues();
  private divineLaws = loadDivineLaws();
  private constraints = loadConstraints();
  private rights = loadRights();
  private balanceRules = loadBalanceRules();
  private identity = loadIdentity();
  private currentMode: "observe" | "advise" | "semi-auto" | "full-auto" = "observe";

  /**
   * Get high-level overview snapshot
   */
  async getOverviewSnapshot(): Promise<OverviewSnapshot> {
    // Get organ statuses (stubbed for MVP)
    const organStatus = await this.getOrganStatuses();
    
    // Get global health (stubbed for MVP)
    const globalHealth = {
      traffic: 0, // TODO: Get from metrics
      errorRate: 0, // TODO: Get from metrics
      latency: 0, // TODO: Get from metrics
      uptime: 99.97, // TODO: Calculate from uptime tracking
    };
    
    // Get current mood (derived from traits)
    const currentMood = {
      traits: this.identity.coreTraits,
      state: "Cautiously Bold", // Primary trait
      indicators: [
        { type: "caution", value: 7, label: "Cautious" },
        { type: "boldness", value: 6, label: "Bold" },
        { type: "defense", value: 8, label: "Defensive" },
        { type: "exploration", value: 5, label: "Exploratory" },
      ],
    };
    
    // Get destiny alignment (stubbed for MVP)
    const destinyAlignment = {
      phase: "Phase I: Foundation and Coherence (0-12 months)",
      progress: 25, // TODO: Calculate from actual progress
      goals: [
        { name: "Stability", status: "on-track" as const, progress: 80 },
        { name: "Growth", status: "on-track" as const, progress: 60 },
        { name: "User Benefit", status: "behind" as const, progress: 40 },
        { name: "Defense", status: "on-track" as const, progress: 90 },
      ],
      overallAlignment: 67.5, // Average of goal progress
    };
    
    // Get recent activity (stubbed for MVP)
    const recentActivity = [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: "defense",
        description: "Shield Core neutralized threat",
        source: "Shield Core",
      },
      {
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        description: "DreamKeeper healed database issue",
        type: "healing",
        source: "DreamKeeper",
      },
      {
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        type: "event",
        description: "StarBridge processed events",
        source: "StarBridge",
      },
    ];
    
    return {
      organismStatus: {
        health: "healthy",
        mode: this.currentMode,
        uptime: globalHealth.uptime,
        avgResponseTime: globalHealth.latency,
      },
      organStatus,
      globalHealth,
      currentMood,
      destinyAlignment,
      recentActivity,
      identity: this.identity,
      coreValues: this.coreValues,
    };
  }

  /**
   * Get consciousness snapshot
   */
  async getConsciousnessSnapshot(): Promise<ConsciousnessSnapshot> {
    // Get attention focus (stubbed based on values)
    const focusAreas: FocusArea[] = [
      {
        name: "System Stability",
        percentage: 40,
        priority: 2, // Stability is second priority
      },
      {
        name: "Threat Detection",
        percentage: 30,
        priority: 1, // Defense is highest priority
      },
      {
        name: "Economic Activity",
        percentage: 20,
        priority: 5, // Growth is fifth priority
      },
      {
        name: "Agent Coordination",
        percentage: 10,
        priority: 6, // Exploration is lowest priority
      },
    ];
    
    const salienceScore = 8.5; // High alert (stubbed)
    
    // Get perception sources
    const perception: { sources: PerceptionSource[]; currentInputs: string[] } = {
      sources: [
        { name: "StarBridge", type: "event", active: true },
        { name: "Nerve Bus", type: "event", active: true },
        { name: "Instant Mesh", type: "event", active: true },
        { name: "API Calls", type: "api", active: true },
        { name: "User Actions", type: "user", active: true },
        { name: "System Logs", type: "log", active: true },
      ],
      currentInputs: [
        "StarBridge events",
        "API requests",
        "Agent reports",
        "Health metrics",
      ],
    };
    
    // Get reason decisions (stubbed examples)
    const reasonDecisions: ReasonDecision[] = [
      {
        id: "decision-1",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: "architecture-change",
        description: "Architecture Change Proposal",
        cursorAnalysis: "Optimize database connections to reduce latency by 15%",
        values: ["Stability", "Growth"],
        status: "approved",
        outcome: "Executed successfully",
      },
      {
        id: "decision-2",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: "economic-parameter",
        description: "Economic Parameter Adjustment",
        cursorAnalysis: "Adjust token distribution to improve fairness",
        values: ["Fairness", "Growth"],
        status: "approved",
        outcome: "Executed successfully",
      },
    ];
    
    // Get reflex events (stubbed examples)
    const reflexEvents: ReflexEvent[] = [
      {
        id: "reflex-1",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: "threat-neutralization",
        description: "Threat Neutralized",
        latency: 45,
        outcome: "Shield Core activated (Alpha → Beta)",
      },
      {
        id: "reflex-2",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: "error-recovery",
        description: "Error Recovered",
        latency: 120,
        outcome: "DreamKeeper healed database connection",
      },
    ];
    
    // Get value trade-offs (stubbed examples)
    const valueTradeOffs = [
      {
        decisionId: "decision-1",
        chosen: { value: "Stability", impact: 15 },
        sacrificed: { value: "Growth", impact: -5 },
        neutral: ["Defense"],
      },
      {
        decisionId: "decision-2",
        chosen: { value: "Fairness", impact: 20 },
        sacrificed: { value: "Stability", impact: -3 },
        neutral: ["Defense"],
      },
    ];
    
    // Get learning (stubbed)
    const learning = {
      patternsLearned: [
        {
          id: "pattern-1",
          name: "Threat Pattern: SQL injection",
          description: "SQL injection → Shield activation",
          learnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ],
      strategiesUpdated: [
        {
          id: "strategy-1",
          name: "Shield Core Strategy",
          description: "+3 new threat patterns",
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      ],
    };
    
    return {
      attention: {
        focusAreas,
        salienceScore,
        trends: [], // TODO: Implement trend tracking
      },
      reasonDecisions,
      reflexEvents,
      valueTradeOffs,
      learning,
      perception,
    };
  }

  /**
   * Get governance snapshot
   */
  async getGovernanceSnapshot(): Promise<GovernanceSnapshot> {
    return {
      divineLaws: this.divineLaws,
      coreValues: this.coreValues,
      constraints: this.constraints,
      rights: this.rights,
      balanceRules: this.balanceRules,
    };
  }

  /**
   * Evaluate an action against Divine Laws
   */
  evaluateActionAgainstLaws(input: ActionCandidate): LawEvaluationResult {
    const violations: LawEvaluationResult["violations"] = [];
    const warnings: string[] = [];
    const passedLaws: string[] = [];
    
    // Check each Divine Law
    for (const law of this.divineLaws) {
      let passed = true;
      let violationReason = "";
      
      // Simple heuristic checks based on action type and description
      const actionLower = input.description.toLowerCase();
      const typeLower = input.type.toLowerCase();
      
      switch (law.id) {
        case "circulation":
          // Check if action blocks value flow
          if (actionLower.includes("block") && actionLower.includes("token")) {
            passed = false;
            violationReason = "Action would block value flow";
          }
          break;
          
        case "breath":
          // Check if action blocks communication
          if (actionLower.includes("block") && (actionLower.includes("event") || actionLower.includes("communication"))) {
            passed = false;
            violationReason = "Action would block communication";
          }
          break;
          
        case "memory":
          // Check if action causes data loss
          if (actionLower.includes("delete") && !actionLower.includes("backup")) {
            passed = false;
            violationReason = "Action may cause data loss";
          }
          break;
          
        case "emergence":
          // Check if action suppresses emergence
          if (actionLower.includes("disable") && actionLower.includes("agent")) {
            passed = false;
            violationReason = "Action would suppress emergence";
          }
          break;
          
        case "defense":
          // Check if action disables defense
          if (actionLower.includes("disable") && (actionLower.includes("shield") || actionLower.includes("defense"))) {
            passed = false;
            violationReason = "Action would disable defense";
          }
          break;
          
        case "identity":
          // Check if action compromises identity
          if (actionLower.includes("modify") && actionLower.includes("identity")) {
            passed = false;
            violationReason = "Action would compromise identity";
          }
          break;
          
        case "balance":
          // Check if action creates imbalance
          if (actionLower.includes("scale") && !actionLower.includes("stability")) {
            warnings.push("Action may create imbalance between growth and stability");
          }
          break;
          
        case "evolution":
          // Check if action causes stagnation
          if (actionLower.includes("disable") && actionLower.includes("learning")) {
            passed = false;
            violationReason = "Action would cause stagnation";
          }
          break;
      }
      
      if (passed) {
        passedLaws.push(law.id);
      } else {
        violations.push({
          lawId: law.id,
          lawName: law.name,
          reason: violationReason,
          severity: law.id === "defense" || law.id === "identity" ? "critical" : "high",
        });
      }
    }
    
    return {
      valid: violations.length === 0,
      violations,
      warnings,
      passedLaws,
    };
  }

  /**
   * Classify an event as REFLEX or REASON
   */
  classifyEventPath(input: EventCandidate): "REFLEX" | "REASON" {
    // Reflex triggers: critical threats, errors, outages, instability
    if (input.severity === "critical") {
      return "REFLEX";
    }
    
    if (input.type.toLowerCase().includes("threat") || 
        input.type.toLowerCase().includes("error") ||
        input.type.toLowerCase().includes("outage") ||
        input.type.toLowerCase().includes("instability")) {
      return "REFLEX";
    }
    
    // Reason triggers: planning, architecture, strategy, evolution
    if (input.type.toLowerCase().includes("plan") ||
        input.type.toLowerCase().includes("architecture") ||
        input.type.toLowerCase().includes("strategy") ||
        input.type.toLowerCase().includes("evolution")) {
      return "REASON";
    }
    
    // Default to REASON for safety (slower but safer)
    return "REASON";
  }

  /**
   * Get organ statuses (stubbed for MVP)
   */
  private async getOrganStatuses(): Promise<OverviewSnapshot["organStatus"]> {
    const baseStatus: OrganStatus = {
      name: "",
      status: "operational",
      healthScore: 95,
      lastUpdate: new Date(),
    };
    
    return {
      dreamOps: { ...baseStatus, name: "DreamOps" },
      dreamKeeper: { ...baseStatus, name: "DreamKeeper" },
      shieldCore: { ...baseStatus, name: "Shield Core" },
      starBridge: { ...baseStatus, name: "StarBridge" },
      dreamVault: { ...baseStatus, name: "DreamVault" },
      controlCore: { ...baseStatus, name: "Control Core" },
    };
  }
}

// Singleton instance
let controlCoreInstance: ControlCore | null = null;

/**
 * Get the Control Core instance (singleton)
 */
export function getControlCore(): ControlCore {
  if (!controlCoreInstance) {
    controlCoreInstance = new ControlCore();
  }
  return controlCoreInstance;
}

