import type { AgentRegistryContext } from '../types.js';
/**
 * Seed known agents (config only).
 * These can mirror your existing subsystems and named agents.
 */
export declare function ensureDefaultAgentsSeeded(): void;
/**
 * Simple heuristic: adjust trust/risk from FieldLayer + ReputationLattice if available.
 */
export declare function refreshAgentScores(ctx: AgentRegistryContext): void;
/**
 * Optionally, callers (or other subsystems) can record agent activity via these helpers.
 * These do not run agents, they just record that something happened.
 */
export declare function recordAgentSuccess(agentId: string, latencyMs?: number): void;
export declare function recordAgentError(agentId: string, errorMessage: string): void;
//# sourceMappingURL=healthUpdater.d.ts.map