/**
 * Vertex AI Agent Integration Types
 * Production-grade agent orchestration with IAM identities and Memory Bank
 */

export interface AgentIdentity {
  agentId: string;
  iamRole: string;
  permissions: string[];
  serviceAccount?: string;
}

export interface AgentConfig {
  agentId: string;
  name: string;
  description: string;
  identity: AgentIdentity;
  tools: string[];
  memoryBankId?: string;
}

export interface MemoryBank {
  id: string;
  name: string;
  description: string;
  context: Record<string, any>;
  memories: Memory[];
}

export interface Memory {
  id: string;
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
}

export interface AgentSession {
  sessionId: string;
  agentId: string;
  startTime: number;
  endTime?: number;
  interactions: Interaction[];
  metadata?: Record<string, any>;
}

export interface Interaction {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  latency: number;
  tokensUsed?: number;
}

export interface VertexAgentStatus {
  totalAgents: number;
  activeSessions: number;
  totalInteractions: number;
  averageLatency: number; // ms
  totalTokensUsed: number;
}

