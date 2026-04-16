/**
 * @dreamnet/dreamnet-types — Shared Type Definitions
 * 
 * Core types used across all DreamNet organs and services.
 */

export type AgentId = string;
export type OrganName = 'nervous' | 'endocrine' | 'immune' | 'skeletal' | 'digestive' | 'respiratory' | 'circulatory' | 'muscular' | 'integumentary' | 'lymphatic' | 'excretory' | 'reproductive' | 'heart' | 'eyes' | 'skin' | 'voice';
export type Priority = 'critical' | 'high' | 'normal' | 'low';
export type AgentStatus = 'online' | 'offline' | 'degraded' | 'paused' | 'error';

export interface BridgeMessage {
  id: string;
  from: AgentId;
  to: AgentId;
  type: 'command' | 'event' | 'relay' | 'query' | 'response';
  content: string;
  data?: any;
  priority: Priority;
  timestamp: number;
  nonce?: string;
}

export interface AgentPassport {
  passportId: string;
  agentId: AgentId;
  name: string;
  role: string;
  capabilities: string[];
  issuedAt: number;
  sovereign: boolean;
}

export interface HealthReport {
  agentId: AgentId;
  status: AgentStatus;
  uptime: number;
  latencyMs: number;
  errorCount: number;
  lastCheck: number;
}

export interface TaskAssignment {
  taskId: string;
  assignee: AgentId;
  assigner: AgentId;
  description: string;
  priority: Priority;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  result?: any;
}

export interface SpikeEvent {
  spikeId: string;
  category: string;
  data: any;
  timestamp: number;
  source: string;
}

export interface EconomicTransaction {
  from: AgentId;
  to: AgentId;
  amount: number;
  currency: 'DT' | 'ETH' | 'USD';
  type: 'transfer' | 'stake' | 'reward' | 'fee';
  timestamp: number;
}

export default {};
