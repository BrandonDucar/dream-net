export type SporeType = "prompt" | "template" | "config" | "workflow" | "custom";

export type SporeStatus = "draft" | "published" | "archived" | "deprecated";

export interface SporeModel {
  id: string;
  name: string;
  description?: string;
  type: SporeType;
  status: SporeStatus;
  content: string | Record<string, unknown>;
  metadata?: {
    tags?: string[];
    author?: string;
    version?: string;
    parentId?: string;
    branchId?: string;
    lineage?: string[];
  };
  distribution?: {
    targetAgents?: string[];
    targetSquads?: string[];
    targetRoles?: string[];
    autoDeploy?: boolean;
  };
  stats?: {
    usageCount?: number;
    successCount?: number;
    failureCount?: number;
    lastUsed?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface SporeLineage {
  sporeId: string;
  parentId?: string;
  branchId?: string;
  children: string[];
  siblings: string[];
  ancestors: string[];
  descendants: string[];
}

export interface SporeDistribution {
  sporeId: string;
  targetAgentId?: string;
  targetSquadId?: string;
  targetRole?: string;
  deployedAt: Date;
  deployedBy?: string;
  status: "deployed" | "failed" | "revoked";
}

