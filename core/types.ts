/**
 * Core types for DreamNet multi-agent system
 * CultureCoiner + MemeEngine stack
 */

export interface DreamContext {
  env: {
    OPENAI_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    GROK_API_KEY?: string;
    ZORA_API_KEY?: string;
    BASE_RPC_URL?: string;
    ALCHEMY_API_KEY?: string;
    INFURA_API_KEY?: string;
    SENTRY_DSN?: string;
    LOG_LEVEL?: string;
    // extend as needed
  };
  logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  };
  // add any shared config (base URLs, chain ids, etc.)
  config?: {
    baseUrl?: string;
    chainId?: number;
    [key: string]: any;
  };
}

export interface AgentPayload {
  task: string;
  data?: any;
  context?: DreamContext;
}

export interface AgentResult {
  success: boolean;
  output: any;
  logs?: string[];
  error?: string;
  metadata?: {
    agent: string;
    task: string;
    duration?: number;
    timestamp?: number;
  };
}

export interface Agent {
  name: string;
  run(payload: AgentPayload): Promise<AgentResult>;
  description?: string;
  capabilities?: string[];
}

