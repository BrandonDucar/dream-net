# Spore Engine - Complete Documentation

**Package**: `@dreamnet/spore-engine`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Spore Engine provides **spore model management** for prompts, templates, configs, workflows, and custom spores. It enables spore distribution, lineage tracking, and versioning.

### Key Features

- **Spore Management**: Create, publish, and manage spores
- **Lineage Tracking**: Track spore parent-child relationships
- **Distribution**: Distribute spores to agents, squads, and roles
- **Versioning**: Track spore versions and branches
- **Usage Statistics**: Track spore usage and success rates

---

## API Reference

### Types

```typescript
export type SporeType = "prompt" | "template" | "config" | "workflow" | "custom";
export type SporeStatus = "draft" | "published" | "archived" | "deprecated";

export interface SporeModel {
  id: string;
  name: string;
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
  };
  createdAt: Date;
  updatedAt: Date;
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
  status: "deployed" | "failed" | "revoked";
}
```

### Functions

- **`createSporeRouter()`**: Create spore router

---

**Status**: ✅ Implemented

