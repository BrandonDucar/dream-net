# DreamNet Server Services - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Total Services**: 14

---

## Overview

The DreamNet server includes 14 service modules that provide core functionality for API key management, audit trails, budget control, domain management, agent orchestration, and more. These services are used throughout the server's route handlers and core systems.

---

## Services

### 1. `DreamNetApiKeyService.ts` - API Key Management

**Purpose**: Generates, validates, and manages DreamNet API keys for user authentication.

**Key Functions**:
- `createApiKey(options)` - Create new API key (returns plaintext once)
- `validateApiKey(key)` - Validate API key and return key info
- `listApiKeys(userId?, walletAddress?)` - List API keys for user/wallet
- `revokeApiKey(keyId, userId?, walletAddress?)` - Revoke an API key
- `getApiKeyById(keyId)` - Get API key by ID (admin)
- `getOrCreateDefaultApiKey(walletAddress?, userId?)` - Auto-generate default key

**Key Format**: `dn_live_<64 hex chars>`

**Storage**:
- Keys are hashed (SHA-256) before storage
- Only key prefix is stored for display
- Plaintext key shown only once on creation

**Database Schema**: Uses `dreamnetApiKeys` table from `shared/schema.ts`

**Usage**:
```typescript
import { createApiKey, validateApiKey } from '../services/DreamNetApiKeyService';

// Create API key
const { key, keyInfo } = await createApiKey({
  walletAddress: '0x123...',
  name: 'My API Key',
  permissions: ['read', 'write'],
  rateLimit: 1000,
});

// Validate API key (used by middleware)
const keyInfo = await validateApiKey('dn_live_abc123...');
```

**Why**: Provides secure API key-based authentication for programmatic access to DreamNet API.

---

### 2. `AuditTrailService.ts` - Audit Logging

**Purpose**: Simple in-memory audit trail for tracking system events.

**Key Functions**:
- `writeAudit(path, action, outcome, timestamp, userId?, metadata?)` - Write audit entry
- `getAuditStats()` - Get audit statistics
- `getEntries(limit?)` - Get recent audit entries

**Storage**: In-memory (max 10,000 entries)

**Note**: Should be replaced with persistent store (database) in production.

**Usage**:
```typescript
import { auditTrail } from '../services/AuditTrailService';

await auditTrail.writeAudit(
  '/api/dreams/create',
  'create_dream',
  'success',
  Date.now(),
  userId,
  { dreamId: 'dream-123' }
);
```

**Why**: Provides audit trail for compliance and debugging.

---

### 3. `BudgetControlService.ts` - Budget Management

**Purpose**: Tracks and enforces budget limits for external service providers (OpenAI, etc.).

**Key Functions**:
- `setBudgetLimit(provider, monthlyUsd)` - Set monthly budget limit
- `getBudgetStatus(provider)` - Get budget status
- `getAllBudgets()` - Get all budget statuses
- `requireBudget(provider, estimatedCost)` - Throw if over budget
- `recordUsage(provider, cost)` - Record usage
- `checkBudget(provider, estimatedCost)` - Check if operation allowed
- `resetBudget(provider)` - Reset budget usage

**Storage**: In-memory Map

**Usage**:
```typescript
import { BudgetControlService } from '../services/BudgetControlService';

// Set budget
BudgetControlService.setBudgetLimit('openai', 100); // $100/month

// Check before operation
BudgetControlService.requireBudget('openai', 0.01); // Throws if over budget

// Record usage
BudgetControlService.recordUsage('openai', 0.01);
```

**Why**: Prevents cost overruns by enforcing budget limits before expensive operations.

---

### 4. `DomainKeeper.ts` - Domain Management

**Purpose**: Self-healing domain management - ensures `dreamnet.ink` is always attached to correct Vercel project and DNS records are synced.

**Key Functions**:
- `syncProductionDomain()` - Sync production domain (dreamnet.ink)
- `syncStagingDomain()` - Sync staging domain (staging.dreamnet.ink)
- `syncAllDomains()` - Sync all domains

**Integration**:
- Uses Vercel API to attach domains
- Uses DNS provider (Cloudflare) to sync DNS records
- Idempotent - safe to call multiple times

**Environment Variables**:
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_PROJECT_NAME` - Vercel project name (default: "dream-net")
- `PRIMARY_DOMAIN` - Primary domain (default: "dreamnet.ink")
- `STAGING_DOMAIN` - Staging domain (optional)
- `DNS_PROVIDER` - DNS provider ("cloudflare" or "none")
- `CF_API_TOKEN` - Cloudflare API token
- `CF_ZONE_ID` - Cloudflare zone ID

**Usage**:
```typescript
import { getDomainKeeper } from '../services/DomainKeeper';

const domainKeeper = getDomainKeeper();
const results = await domainKeeper.syncAllDomains();
```

**Why**: Ensures domain configuration is always correct, even if manually changed.

---

### 5. `DreamkeeperArchitect.ts` - Health System Architect (Agent 4)

**Purpose**: Designs health scores, metrics, and diagnostic checks for DreamNet entities (dreams, agents, services, infra).

**Key Functions**:
- `generateDreamkeeperSpec()` - Generate health system specification
- `generateSurgeonProtocols()` - Generate automated repair protocols
- `runDreamkeeperAnalysis()` - Run full Agent 4 analysis

**Outputs**:
- `dreamkeeper_spec` - Health entities, metrics, scoring models, health bands, diagnostic checks
- `surgeon_protocols` - Playbooks, escalation rules, integration points

**Dependencies**:
- Requires `vertex_fusion_snapshot` from Agent 1
- Requires `drone_dome_report` from Agent 2
- Requires `event_fabric_spec` from Agent 3

**Usage**:
```typescript
import { runDreamkeeperAnalysis } from '../services/DreamkeeperArchitect';

const { dreamkeeperSpec, surgeonProtocols } = await runDreamkeeperAnalysis();
```

**Why**: Provides comprehensive health monitoring and automated repair system for DreamNet.

---

### 6. `DroneDomeScanner.ts` - System Health Scanner (Agent 2)

**Purpose**: Ingests `vertex_fusion_snapshot` and builds dome view of overall health, risk, and priorities across agents, apps, services, data, events, integrations, and infra.

**Key Functions**:
- `generateDomeReport()` - Generate drone dome report
- `generateDomeCommands()` - Generate commands for downstream agents
- `runDroneDomeAnalysis()` - Run full Agent 2 analysis

**Outputs**:
- `drone_dome_report` - Overall health, risk zones, priority zones, maps
- `drone_dome_commands` - Commands for Agents 3-8

**Dependencies**:
- Requires `vertex_fusion_snapshot` from Agent 1

**Usage**:
```typescript
import { runDroneDomeAnalysis } from '../services/DroneDomeScanner';

const { report, commands } = await runDroneDomeAnalysis();
```

**Why**: Provides high-level system health overview and risk assessment.

---

### 7. `EventFabricBuilder.ts` - Event System Architect (Agent 3)

**Purpose**: Designs coherent, future-proof event fabric and monitoring blueprint for DreamNet.

**Key Functions**:
- `generateEventFabricSpec()` - Generate event fabric specification
- `generateMonitoringBlueprint()` - Generate monitoring blueprint
- `runEventFabricAnalysis()` - Run full Agent 3 analysis

**Outputs**:
- `event_fabric_spec` - Event families, global conventions, implementation notes
- `monitoring_blueprint` - Streams, dashboards, alerts, storage, rollup jobs

**Dependencies**:
- Requires `vertex_fusion_snapshot` from Agent 1
- Requires `drone_dome_report` from Agent 2

**Usage**:
```typescript
import { runEventFabricAnalysis } from '../services/EventFabricBuilder';

const { eventFabricSpec, monitoringBlueprint } = await runEventFabricAnalysis();
```

**Why**: Provides comprehensive event system design for observability and monitoring.

---

### 8. `AgentHelpers.ts` - Agent Dependency Helpers

**Purpose**: Helper functions for Vertex AI agents (1-8) to easily read upstream outputs and validate dependencies.

**Key Functions**:
- `readUpstreamOutput(agentId, outputType)` - Read upstream output
- `readSnapshot()` - Read Agent 1's snapshot
- `readDomeReport()` - Read Agent 2's dome report
- `readEventFabricSpec()` - Read Agent 3's event fabric spec
- `getAgentDependencies(agentId)` - Get all dependencies for agent
- `validateDependencies(agentId)` - Validate required dependencies exist

**Agent Dependencies**:
- Agent 1: No dependencies
- Agent 2: Depends on Agent 1
- Agent 3: Depends on Agents 1, 2
- Agent 4: Depends on Agents 1, 2, 3
- Agent 5: Depends on Agents 1, 2
- Agent 6: Depends on Agent 1
- Agent 7: Depends on Agents 1, 2
- Agent 8: Depends on all Agents 1-7

**Usage**:
```typescript
import { readSnapshot, getAgentDependencies } from '../services/AgentHelpers';

const snapshot = await readSnapshot();
const deps = await getAgentDependencies(4); // Get dependencies for Agent 4
```

**Why**: Simplifies agent orchestration by providing easy access to upstream outputs.

---

### 9. `AgentOutputStore.ts` - Agent Output Storage

**Purpose**: Stores and retrieves outputs from the 8 Vertex AI agents.

**Key Functions**:
- `storeOutput(agentId, outputType, data, metadata?)` - Store agent output
- `getLatestOutput(agentId, outputType)` - Get latest output
- `getAgentOutputs(agentId)` - Get all outputs for agent
- `getAllLatestOutputs()` - Get all latest outputs across all agents
- `getOutputHistory(agentId, outputType, limit?)` - Get output history

**Storage**: File system (`data/agent-outputs/latest/` and `data/agent-outputs/history/`)

**Agent Output Types**:
- Agent 1: `vertex_fusion_snapshot`
- Agent 2: `drone_dome_report`, `drone_dome_commands`
- Agent 3: `event_fabric_spec`, `monitoring_blueprint`
- Agent 4: `dreamkeeper_spec`, `surgeon_protocols`
- Agent 5: `deploykeeper_blueprint`, `infra_unification_plan`
- Agent 6: `data_spine_spec`, `storage_plan`, `migration_recommendations`
- Agent 7: `socialops_spec`, `external_edge_playbooks`, `risk_and_safety_guidelines`
- Agent 8: `master_blueprint`, `evolution_roadmap`, `risk_matrix`

**Usage**:
```typescript
import { storeOutput, getLatestOutput } from '../services/AgentOutputStore';

await storeOutput(1, 'vertex_fusion_snapshot', snapshot);
const snapshot = await getLatestOutput(1, 'vertex_fusion_snapshot');
```

**Why**: Provides persistent storage for agent outputs, enabling agent orchestration and dependency management.

---

### 10. `BackupService.ts` - Backup Service

**Purpose**: Simple backup service stub (should be implemented in production).

**Key Functions**:
- `createBackup()` - Create backup
- `getBackupStatus()` - Get backup status
- `setAutoBackup(enabled)` - Enable/disable auto-backup

**Status**: Stub implementation - needs production implementation

**Usage**:
```typescript
import { backupService } from '../services/BackupService';

const { success, backupId } = await backupService.createBackup();
```

**Why**: Placeholder for backup functionality (needs implementation).

---

### 11. `FreeTierQuotaService.ts` - Google Cloud Free Tier Quota Tracking

**Purpose**: Tracks Google Cloud Free Tier usage to maximize free resources before using paid credits.

**Key Functions**:
- `getQuotaStatus(quotaType)` - Get quota status
- `getAllQuotaStatuses()` - Get all quota statuses
- `checkQuota(quotaType, estimatedUsage)` - Check if operation allowed
- `requireQuota(quotaType, estimatedUsage)` - Throw if insufficient quota
- `recordUsage(quotaType, usage)` - Record usage
- `resetQuota(quotaType)` - Reset quota
- `resetAllQuotas()` - Reset all quotas (monthly)
- `getCriticalQuotas()` - Get critical quotas (exceeded or near limit)
- `getWarningQuotas()` - Get warning quotas (80-95% used)

**Free Tier Limits** (per month):
- Cloud Run: 2M requests, 360K GB-seconds memory, 180K vCPU-seconds compute, 1GB outbound
- Cloud Build: 2,500 build-minutes
- BigQuery: 1TB querying, 10GB storage
- Cloud Storage: 5GB-months, 5K Class A ops, 50K Class B ops

**Storage**: In-memory Map (resets monthly)

**Usage**:
```typescript
import { FreeTierQuotaService } from '../services/FreeTierQuotaService';

// Check quota before operation
const check = FreeTierQuotaService.checkQuota('cloudrun-requests', 1000);
if (!check.allowed) {
  throw new Error(check.reason);
}

// Record usage
FreeTierQuotaService.recordUsage('cloudrun-requests', 1000);
```

**Why**: Maximizes free tier usage before incurring costs, helping manage Google Cloud spending.

---

### 12. `OTTService.ts` - Over-The-Top Media Service

**Purpose**: Integrates with Jellyfin and PeerTube for media management and publishing.

**Key Functions**:
- `publish(request, clientId)` - Publish content to OTT platforms
- `recordMetric(metricData, clientId)` - Record OTT metrics
- `getConfig()` - Get OTT configuration
- `getStats()` - Get OTT analytics
- `cleanup(retentionDays)` - Cleanup old events

**Platforms**:
- Jellyfin - Media server
- PeerTube - Video platform

**Storage**: In-memory Maps

**Usage**:
```typescript
import { ottService } from '../services/OTTService';

const result = await ottService.publish({
  asset_id: 'asset-123',
  channel: 'main',
  platform: 'jellyfin',
});
```

**Why**: Provides media publishing and analytics for OTT platforms.

---

### 13. `SnapshotGenerator.ts` - Vertex Fusion Snapshot Generator (Agent 1)

**Purpose**: Wrapper around Agent 1's `run()` method for CitadelCore compatibility.

**Key Functions**:
- `generateSnapshot()` - Generate vertex_fusion_snapshot from dreamnet.config.ts

**Dependencies**: Uses Citadel Agent 1

**Usage**:
```typescript
import { generateSnapshot } from '../services/SnapshotGenerator';

const snapshot = await generateSnapshot();
```

**Why**: Provides unified interface for generating system snapshots.

---

### 14. `IntegrationFlagsService.ts` - Feature Flags

**Purpose**: Manages feature flags and integration toggles.

**Key Functions**:
- `requireEnabled(name)` - Require feature enabled (throws if disabled)
- `isEnabled(name)` - Check if feature enabled
- `isBrownout(name)` - Check if feature in brownout mode
- `setIntegrationEnabled(name, enabled, reason?)` - Enable/disable feature
- `enableEmergencyMode(reason?)` - Enable emergency mode (disables all features)
- `disableEmergencyMode()` - Disable emergency mode
- `enableBrownoutMode(reason?)` - Enable brownout mode (graceful degradation)
- `disableBrownoutMode()` - Disable brownout mode
- `getBrownoutStatus()` - Get brownout status
- `getAllFlags()` - Get all flags
- `getIntegrationConfig(name)` - Get integration config
- `getEmergencyStatus()` - Get emergency status
- `validateFlags()` - Validate flags

**Configuration**: Loads from `server/config/feature-flags.yaml`

**Usage**:
```typescript
import { IntegrationFlagsService } from '../services/IntegrationFlagsService';

// Check if feature enabled
if (await IntegrationFlagsService.isEnabled('citadel_enabled')) {
  // Use Citadel
}

// Require feature (throws if disabled)
await IntegrationFlagsService.requireEnabled('ai_embeddings_enabled');
```

**Why**: Provides runtime feature toggles for gradual rollouts and emergency control.

---

## Service Integration

### Service Usage Patterns

1. **API Key Authentication**: Used by `apiKeyAuth.ts` middleware
2. **Budget Control**: Used before expensive operations (OpenAI API calls)
3. **Domain Management**: Used by deployment scripts and health checks
4. **Agent Orchestration**: Used by Citadel agents for dependency management
5. **Feature Flags**: Used throughout server for feature toggles

### Service Dependencies

```
DreamNetApiKeyService → Database (dreamnetApiKeys table)
DomainKeeper → Vercel API, DNS Provider (Cloudflare)
Agent Services → AgentOutputStore → File System
IntegrationFlagsService → YAML Config File
```

---

## Best Practices

1. **Use services for business logic**: Keep route handlers thin, delegate to services
2. **Handle errors gracefully**: Services should throw meaningful errors
3. **Use dependency injection**: Services should accept dependencies via constructor
4. **Idempotent operations**: Services should be safe to call multiple times
5. **Logging**: Services should log important operations for debugging

---

## Future Improvements

1. **Persistent storage**: Replace in-memory storage with database
2. **Caching**: Add caching layer for frequently accessed data
3. **Rate limiting**: Integrate rate limiting into services
4. **Metrics**: Add metrics collection to services
5. **Testing**: Add unit tests for all services

---

**This documentation covers all 14 services in the DreamNet server.**

