/**
 * Local Rules Engine
 *
 * Defines local rules for agents to make decisions based on environment cues
 * Based on ALife swarm principles (local rules, minimal communication)
 */
import type SwarmEnvironment from "./swarmEnvironment.js";
export interface LocalRule {
    id: string;
    agent: string;
    condition: (env: SwarmEnvironment, context: any) => Promise<boolean>;
    action: (env: SwarmEnvironment, context: any) => Promise<void>;
    priority: number;
    description: string;
}
export interface RuleContext {
    agent: string;
    currentLocation: string;
    metrics?: Record<string, number>;
    anomalyDetected?: boolean;
    threatDetected?: boolean;
}
export declare class SwarmRules {
    private rules;
    private environment;
    constructor(environment: SwarmEnvironment);
    /**
     * Initialize default rules for common scenarios
     */
    private initializeDefaultRules;
    /**
     * Add a custom rule
     */
    addRule(rule: LocalRule): void;
    /**
     * Remove a rule
     */
    removeRule(ruleId: string): void;
    /**
     * Evaluate rules for an agent
     */
    evaluateRules(agent: string, context: RuleContext): Promise<void>;
    /**
     * Get all rules for an agent
     */
    getRulesForAgent(agent: string): LocalRule[];
    /**
     * Get all rules
     */
    getAllRules(): LocalRule[];
}
export default SwarmRules;
