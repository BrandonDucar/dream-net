export interface DreamNode {
  id: string;
  name: string;
  token: string;
  creator: string;
  createdAt: number;
  isolation: boolean;
  trustBoundary: number;
  usageCount: number;
  inboxEnabled: boolean;
  mintEnabled: boolean;
  public: boolean;
}

export interface DreamNodeConfig extends DreamNode {
  agentVisibility: string[];
  allowedAccess: string[];
  description?: string;
  version?: string;
}

export interface DreamNodeRegistry {
  nodes: Map<string, DreamNodeConfig>;
  getNode(id: string): DreamNodeConfig | undefined;
  registerNode(node: DreamNodeConfig): void;
  listPublicNodes(): DreamNodeConfig[];
  listNodesByCreator(creator: string): DreamNodeConfig[];
  incrementUsage(nodeId: string): void;
}

export enum NodeCapability {
  INBOX = 'inbox',
  OUTBOX = 'outbox',
  MINT = 'mint',
  EXPORT = 'export',
  IMPORT = 'import'
}

export interface NodeUsageStats {
  nodeId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastUsed: number;
  topUsers: { wallet: string; requestCount: number }[];
}