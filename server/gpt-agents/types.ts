/**
 * GPT Agent Registry Types
 */

export interface CustomGPT {
  name: string;
  link: string | null;
  category: string;
  purpose: string;
  status: "Active" | "Draft";
  date_added: string;
}

export interface GPTAgentRegistration {
  gptId: string;
  agentId: string;
  identityId: string;
  citizenId: string;
  passportId: string;
  tier: string;
  clusterId?: string;
  kind?: string;
  registered: boolean;
  registeredAt: string;
}

export interface GPTAgentStatus {
  gpt: CustomGPT;
  registration?: GPTAgentRegistration;
  isRegistered: boolean;
  lastHeartbeat?: string;
  health?: {
    status: "healthy" | "degraded" | "offline";
    lastSeen: string;
    errorCount: number;
  };
}

export interface GPTRegistryStats {
  total: number;
  registered: number;
  unregistered: number;
  byCategory: Record<string, number>;
  byTier: Record<string, number>;
  byStatus: Record<string, number>;
}

