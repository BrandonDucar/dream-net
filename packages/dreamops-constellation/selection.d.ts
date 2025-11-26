/**
 * Clonal Selection Algorithm
 *
 * Implements clonal selection for evolving agent behaviors based on fitness
 * Based on immune system's clonal selection principle
 */
import type FitnessEvaluator from "./fitnessEvaluator.js";
export interface AgentBehavior {
    id: string;
    agentId: string;
    behavior: Record<string, any>;
    fitness: number;
    generation: number;
    parentId?: string;
    mutations: number;
    createdAt: string;
    lastUsed: string;
}
export declare class ClonalSelection {
    private fitnessEvaluator;
    private behaviors;
    private readonly MIN_FITNESS;
    private readonly CLONE_RATE;
    private readonly MUTATION_RATE;
    constructor(fitnessEvaluator: FitnessEvaluator);
    /**
     * Register an agent behavior
     */
    registerBehavior(agentId: string, behavior: Record<string, any>, generation?: number): AgentBehavior;
    /**
     * Update behavior fitness
     */
    updateBehaviorFitness(behaviorId: string): void;
    /**
     * Perform clonal selection: clone high-fitness behaviors, remove low-fitness
     */
    performSelection(): Promise<void>;
    /**
     * Clone a behavior with mutation
     */
    private cloneBehavior;
    /**
     * Get best behavior for an agent
     */
    getBestBehavior(agentId: string): AgentBehavior | undefined;
    /**
     * Get all behaviors for an agent
     */
    getBehaviorsForAgent(agentId: string): AgentBehavior[];
    /**
     * Get all behaviors
     */
    getAllBehaviors(): AgentBehavior[];
    /**
     * Get behaviors by generation
     */
    getBehaviorsByGeneration(generation: number): AgentBehavior[];
}
export default ClonalSelection;
