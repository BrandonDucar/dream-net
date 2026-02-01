export type AgentRunInput = {
  agent: string;
  input: unknown;
  userId?: string;
  metadata?: Record<string, unknown>;
};

export type AgentResult<T = unknown> = {
  ok: boolean;
  agent: string;
  result?: T;
  messages?: string[];
  debug?: Record<string, unknown>;
  error?: string;
};

export interface AgentContext {
  log: (message: string, extra?: Record<string, unknown>) => void;
  env: Record<string, string | undefined>;
}

export interface Agent {
  name: string;
  description: string;
  run: (ctx: AgentContext, input: unknown) => Promise<AgentResult>;
}


