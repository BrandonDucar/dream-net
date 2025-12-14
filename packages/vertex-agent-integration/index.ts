/**
 * Vertex AI Agent Integration
 * 
 * Production-grade agent orchestration with IAM identities and Memory Bank
 * 
 * Features:
 * - IAM-based agent identities (least-privilege)
 * - Memory Bank integration (long-term memory)
 * - Observability (sessions, logs, traces)
 * - Express mode support (free-tier runtime)
 */

export { createAgent } from './agentFactory';
export { storeMemory, retrieveMemories, updateMemory } from './memoryBank';
export {
  createSession,
  addInteraction,
  endSession,
  getSession,
  getActiveSessions,
} from './observability';

export type {
  AgentIdentity,
  AgentConfig,
  MemoryBank,
  Memory,
  AgentSession,
  Interaction,
  VertexAgentStatus,
} from './types';

import { createAgent } from './agentFactory';
import { storeMemory, retrieveMemories } from './memoryBank';
import { createSession, getActiveSessions } from './observability';

export const VertexAgentIntegration = {
  /**
   * Create agent
   */
  async createAgent(config: import('./types').AgentConfig) {
    return createAgent(config);
  },

  /**
   * Store memory
   */
  async storeMemory(
    memoryBankId: string,
    memory: Omit<import('./types').Memory, 'id' | 'timestamp'>
  ) {
    return storeMemory(memoryBankId, memory);
  },

  /**
   * Retrieve memories
   */
  async retrieveMemories(memoryBankId: string, query: string, limit?: number) {
    return retrieveMemories(memoryBankId, query, limit);
  },

  /**
   * Create session
   */
  createSession(agentId: string, metadata?: Record<string, any>) {
    return createSession(agentId, metadata);
  },

  /**
   * Get active sessions
   */
  getActiveSessions() {
    return getActiveSessions();
  },

  /**
   * Get status
   */
  status(): import('./types').VertexAgentStatus {
    const activeSessions = getActiveSessions();
    const totalInteractions = activeSessions.reduce(
      (sum, s) => sum + s.interactions.length,
      0
    );
    const averageLatency = activeSessions.length > 0
      ? activeSessions.reduce(
          (sum, s) => sum + s.interactions.reduce((s2, i) => s2 + i.latency, 0),
          0
        ) / totalInteractions
      : 0;
    
    return {
      totalAgents: 0, // TODO: track total agents
      activeSessions: activeSessions.length,
      totalInteractions,
      averageLatency,
      totalTokensUsed: 0, // TODO: track tokens
    };
  },
};

export default VertexAgentIntegration;

