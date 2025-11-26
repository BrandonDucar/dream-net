/**
 * Clonal Selection Algorithm
 * 
 * Implements clonal selection for evolving agent behaviors based on fitness
 * Based on immune system's clonal selection principle
 */

import type FitnessEvaluator from "./fitnessEvaluator.js";
import type { AgentFitness } from "./fitnessEvaluator.js";

export interface AgentBehavior {
  id: string;
  agentId: string;
  behavior: Record<string, any>; // Behavior parameters
  fitness: number; // 0-1
  generation: number;
  parentId?: string; // ID of parent behavior
  mutations: number;
  createdAt: string;
  lastUsed: string;
}

export class ClonalSelection {
  private fitnessEvaluator: FitnessEvaluator;
  private behaviors: Map<string, AgentBehavior> = new Map();
  private readonly MIN_FITNESS = 0.3; // Remove behaviors below this
  private readonly CLONE_RATE = 0.1; // Clone top 10% of behaviors
  private readonly MUTATION_RATE = 0.05; // 5% mutation rate

  constructor(fitnessEvaluator: FitnessEvaluator) {
    this.fitnessEvaluator = fitnessEvaluator;
  }

  /**
   * Register an agent behavior
   */
  registerBehavior(
    agentId: string,
    behavior: Record<string, any>,
    generation: number = 1
  ): AgentBehavior {
    const agentFitness = this.fitnessEvaluator.getAgentFitness(agentId);
    const fitness = agentFitness?.metrics.overall || 0.5;

    const agentBehavior: AgentBehavior = {
      id: `behavior-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      behavior,
      fitness,
      generation,
      mutations: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };

    this.behaviors.set(agentBehavior.id, agentBehavior);
    return agentBehavior;
  }

  /**
   * Update behavior fitness
   */
  updateBehaviorFitness(behaviorId: string): void {
    const behavior = this.behaviors.get(behaviorId);
    if (!behavior) {
      return;
    }

    const agentFitness = this.fitnessEvaluator.getAgentFitness(behavior.agentId);
    if (agentFitness) {
      behavior.fitness = agentFitness.metrics.overall;
      behavior.lastUsed = new Date().toISOString();
    }
  }

  /**
   * Perform clonal selection: clone high-fitness behaviors, remove low-fitness
   */
  async performSelection(): Promise<void> {
    // Remove low-fitness behaviors
    const toRemove: string[] = [];
    for (const [id, behavior] of this.behaviors.entries()) {
      if (behavior.fitness < this.MIN_FITNESS && behavior.generation > 1) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      this.behaviors.delete(id);
    }

    // Clone high-fitness behaviors
    const behaviorsByAgent = new Map<string, AgentBehavior[]>();
    for (const behavior of this.behaviors.values()) {
      if (!behaviorsByAgent.has(behavior.agentId)) {
        behaviorsByAgent.set(behavior.agentId, []);
      }
      behaviorsByAgent.get(behavior.agentId)!.push(behavior);
    }

    for (const [agentId, behaviors] of behaviorsByAgent.entries()) {
      // Sort by fitness
      behaviors.sort((a, b) => b.fitness - a.fitness);

      // Clone top CLONE_RATE
      const numToClone = Math.max(1, Math.floor(behaviors.length * this.CLONE_RATE));
      const topBehaviors = behaviors.slice(0, numToClone);

      for (const parent of topBehaviors) {
        if (parent.fitness > 0.7) {
          // Clone with mutation
          const clone = this.cloneBehavior(parent);
          this.behaviors.set(clone.id, clone);
        }
      }
    }
  }

  /**
   * Clone a behavior with mutation
   */
  private cloneBehavior(parent: AgentBehavior): AgentBehavior {
    const clonedBehavior: Record<string, any> = { ...parent.behavior };

    // Apply mutations
    for (const key in clonedBehavior) {
      if (Math.random() < this.MUTATION_RATE) {
        const value = clonedBehavior[key];
        
        if (typeof value === "number") {
          // Mutate number by ±10%
          clonedBehavior[key] = value * (1 + (Math.random() - 0.5) * 0.2);
        } else if (typeof value === "boolean") {
          // Flip boolean
          clonedBehavior[key] = !value;
        } else if (Array.isArray(value)) {
          // Mutate array (add/remove/change element)
          if (value.length > 0 && Math.random() < 0.3) {
            const index = Math.floor(Math.random() * value.length);
            if (typeof value[index] === "number") {
              value[index] = value[index] * (1 + (Math.random() - 0.5) * 0.2);
            }
          }
        }
      }
    }

    return {
      id: `behavior-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId: parent.agentId,
      behavior: clonedBehavior,
      fitness: parent.fitness * 0.9, // Start slightly lower (will improve if good)
      generation: parent.generation + 1,
      parentId: parent.id,
      mutations: parent.mutations + 1,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
  }

  /**
   * Get best behavior for an agent
   */
  getBestBehavior(agentId: string): AgentBehavior | undefined {
    const behaviors = Array.from(this.behaviors.values())
      .filter(b => b.agentId === agentId)
      .sort((a, b) => b.fitness - a.fitness);

    return behaviors[0];
  }

  /**
   * Get all behaviors for an agent
   */
  getBehaviorsForAgent(agentId: string): AgentBehavior[] {
    return Array.from(this.behaviors.values())
      .filter(b => b.agentId === agentId)
      .sort((a, b) => b.fitness - a.fitness);
  }

  /**
   * Get all behaviors
   */
  getAllBehaviors(): AgentBehavior[] {
    return Array.from(this.behaviors.values());
  }

  /**
   * Get behaviors by generation
   */
  getBehaviorsByGeneration(generation: number): AgentBehavior[] {
    return Array.from(this.behaviors.values())
      .filter(b => b.generation === generation);
  }
}

export default ClonalSelection;

