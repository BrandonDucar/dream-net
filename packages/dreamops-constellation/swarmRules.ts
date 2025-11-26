/**
 * Local Rules Engine
 * 
 * Defines local rules for agents to make decisions based on environment cues
 * Based on ALife swarm principles (local rules, minimal communication)
 */

import type SwarmEnvironment from "./swarmEnvironment.js";
import type { EnvironmentMarker } from "./swarmEnvironment.js";

export interface LocalRule {
  id: string;
  agent: string; // Which agent this rule applies to
  condition: (env: SwarmEnvironment, context: any) => Promise<boolean>;
  action: (env: SwarmEnvironment, context: any) => Promise<void>;
  priority: number; // Higher priority rules execute first
  description: string;
}

export interface RuleContext {
  agent: string;
  currentLocation: string;
  metrics?: Record<string, number>;
  anomalyDetected?: boolean;
  threatDetected?: boolean;
}

export class SwarmRules {
  private rules: Map<string, LocalRule> = new Map();
  private environment: SwarmEnvironment;

  constructor(environment: SwarmEnvironment) {
    this.environment = environment;
    this.initializeDefaultRules();
  }

  /**
   * Initialize default rules for common scenarios
   */
  private initializeDefaultRules(): void {
    // Rule 1: If anomaly detected → mark environment with threat signal
    this.addRule({
      id: "rule-anomaly-threat-signal",
      agent: "all",
      condition: async (env, context: RuleContext) => {
        return context.anomalyDetected === true;
      },
      action: async (env, context: RuleContext) => {
        await env.placeMarker("flag", context.currentLocation, {
          type: "threat",
          severity: context.metrics?.severity || 0.5,
          detectedBy: context.agent,
        }, 1.0, 30 * 60 * 1000); // 30 minute TTL
        console.log(`[SwarmRules] ${context.agent} placed threat signal at ${context.currentLocation}`);
      },
      priority: 10,
      description: "If anomaly detected, mark environment with threat signal",
    });

    // Rule 2: If threat signal present → increase monitoring frequency
    this.addRule({
      id: "rule-threat-increase-monitoring",
      agent: "all",
      condition: async (env, context: RuleContext) => {
        const markers = await env.readMarkers(context.currentLocation, "flag");
        return markers.some(m => m.value?.type === "threat");
      },
      action: async (env, context: RuleContext) => {
        await env.placePheromone(
          context.currentLocation,
          { type: "increased_monitoring", agent: context.agent },
          0.8,
          0.05 // Slow decay
        );
        console.log(`[SwarmRules] ${context.agent} increased monitoring at ${context.currentLocation}`);
      },
      priority: 8,
      description: "If threat signal present, increase monitoring frequency",
    });

    // Rule 3: If multiple agents detect same threat → escalate to Stage 2
    this.addRule({
      id: "rule-multiple-agents-escalate",
      agent: "all",
      condition: async (env, context: RuleContext) => {
        const pheromones = await env.readPheromones(context.currentLocation);
        const threatPheromones = pheromones.filter(p => p.value?.type === "threat");
        return threatPheromones.length >= 2; // Multiple agents detected
      },
      action: async (env, context: RuleContext) => {
        await env.placeMarker("status", context.currentLocation, {
          type: "escalated",
          stage: 2,
          escalatedBy: context.agent,
          timestamp: new Date().toISOString(),
        }, 1.0);
        console.log(`[SwarmRules] ${context.agent} escalated to Stage 2 at ${context.currentLocation}`);
      },
      priority: 9,
      description: "If multiple agents detect same threat, escalate to Stage 2",
    });

    // Rule 4: If threat resolved → clear environment markers
    this.addRule({
      id: "rule-threat-resolved-clear",
      agent: "all",
      condition: async (env, context: RuleContext) => {
        // Check if threat was resolved (would come from context)
        return context.threatDetected === false && context.anomalyDetected === false;
      },
      action: async (env, context: RuleContext) => {
        await env.clearMarkers(context.currentLocation);
        console.log(`[SwarmRules] ${context.agent} cleared markers at ${context.currentLocation}`);
      },
      priority: 5,
      description: "If threat resolved, clear environment markers",
    });

    // Rule 5: If deployment successful → place success marker
    this.addRule({
      id: "rule-deployment-success",
      agent: "DeployKeeper",
      condition: async (env, context: RuleContext) => {
        return context.metrics?.deploymentStatus === "success";
      },
      action: async (env, context: RuleContext) => {
        await env.placeMarker("tag", context.currentLocation, {
          type: "deployment_success",
          timestamp: new Date().toISOString(),
        }, 1.0, 60 * 60 * 1000); // 1 hour TTL
        console.log(`[SwarmRules] DeployKeeper placed success marker at ${context.currentLocation}`);
      },
      priority: 3,
      description: "If deployment successful, place success marker",
    });
  }

  /**
   * Add a custom rule
   */
  addRule(rule: LocalRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove a rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Evaluate rules for an agent
   */
  async evaluateRules(agent: string, context: RuleContext): Promise<void> {
    const applicableRules = Array.from(this.rules.values())
      .filter(r => r.agent === "all" || r.agent === agent)
      .sort((a, b) => b.priority - a.priority); // Higher priority first

    for (const rule of applicableRules) {
      try {
        const conditionMet = await rule.condition(this.environment, context);
        if (conditionMet) {
          await rule.action(this.environment, context);
          // Only execute first matching rule (highest priority)
          break;
        }
      } catch (error: any) {
        console.error(`[SwarmRules] Error evaluating rule ${rule.id}:`, error.message);
      }
    }
  }

  /**
   * Get all rules for an agent
   */
  getRulesForAgent(agent: string): LocalRule[] {
    return Array.from(this.rules.values())
      .filter(r => r.agent === "all" || r.agent === agent)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get all rules
   */
  getAllRules(): LocalRule[] {
    return Array.from(this.rules.values());
  }
}

export default SwarmRules;

