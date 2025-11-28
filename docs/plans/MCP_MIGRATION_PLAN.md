# MCP (Model Context Protocol) Migration Plan

## Overview

Migrate DreamNet's custom tool connectors to MCP (Model Context Protocol) standard for unified agent tool access and future-proofing.

## Why Migrate

- **Standardization:** MCP eliminates M×N integration problem (one MCP server per tool, any agent can use it)
- **Future-proofing:** New agent frameworks expect MCP servers
- **Modularity:** Easier maintenance, swapping, and reuse of tools
- **Governance:** MCP Gateways provide centralized observability, access control, quotas, security

## Current State Analysis

**Legacy connectors to audit:**
- GitHub integration (custom API calls)
- Database connectors (direct queries)
- Cloud provider APIs (GCP, AWS)
- Internal bots/agents (custom tool wiring)
- External APIs (Stripe, Twilio, OpenAI, etc.)

## Migration Phases

### Phase 1: Audit & Inventory

**Tasks:**
1. List all existing custom connectors/tools
2. Document current tool invocation patterns
3. Identify high-value tools for initial migration
4. Map current tool schemas to MCP tool schemas

**Deliverables:**
- `docs/mcp-migration-audit.md` - Complete inventory
- Tool dependency graph
- Priority ranking for migration

### Phase 2: Deploy MCP Backplane

**Files to create:**
- `packages/mcp-backbone/src/MCPServer.ts` - Core MCP server implementation
- `packages/mcp-backbone/src/MCPGateway.ts` - Gateway for observability/governance
- `packages/mcp-backbone/src/MCPRouter.ts` - Tool routing logic

**Dependencies:**
```json
{
  "@modelcontextprotocol/sdk": "^1.0.0"
}
```

**Infrastructure:**
- Deploy MCP server behind TLS/HTTPS
- Set up MCP Gateway (optional but recommended)
- Configure access control and quotas

### Phase 3: Migrate High-Value Tools

**Priority tools:**
1. GitHub integration → MCP GitHub server
2. Database queries → MCP Database server
3. Cloud Run deployment → MCP Cloud Run server

**Files to create:**
- `packages/mcp-servers/github/src/GitHubMCPServer.ts`
- `packages/mcp-servers/database/src/DatabaseMCPServer.ts`
- `packages/mcp-servers/cloud-run/src/CloudRunMCPServer.ts`

**Tool schemas:**
- Define input/output schemas for each tool
- Map existing API calls to MCP tool invocations
- Add metadata (capabilities, costs, rate limits)

### Phase 4: Refactor Agents to MCP Clients

**Files to update:**
- `packages/dream-cortex/src/agents/*` - Update to use MCP clients
- `packages/super-spine/superSpine.ts` - Add MCP client integration
- `packages/dreamnet-agent-client/*` - Add MCP support

**MCP Client implementation:**
- Replace direct API calls with MCP tool invocations
- Handle MCP responses and errors
- Maintain backward compatibility during transition

### Phase 5: Observability & Governance

**Files to create:**
- `packages/mcp-gateway/src/MCPMetrics.ts` - Usage tracking
- `packages/mcp-gateway/src/MCPQuotas.ts` - Rate limiting
- `packages/mcp-gateway/src/MCPAuth.ts` - Authentication/authorization

**Integration:**
- Connect to existing observability (Spider Web Core)
- Add cost/time tracking per tool invocation
- Implement budget policies

### Phase 6: CI/Eval Gates

**Files to create:**
- `.github/workflows/mcp-tool-eval.yml` - Pre-deploy tool evaluation
- `scripts/mcp-tool-budget-check.ts` - Budget validation

**Gates:**
- Enforce cost/time budgets per tool invocation
- Block deployments if tool usage exceeds limits
- Require tool schema validation

## Integration with DreamNet Spine

**Leverage existing Spine:**
- Use `spine/dreamnet-mcp-bridge/` as foundation
- Connect MCP servers to Agent Interop Registry
- Route MCP tools through Agent BGP
- Use Event Bus for MCP tool events

## Success Criteria

- At least 2 high-value tools migrated to MCP servers
- Agents successfully using MCP clients instead of direct APIs
- MCP Gateway providing observability and governance
- CI gates enforcing tool budgets
- Documentation complete for MCP tool development

## Timeline Estimate

- Phase 1: 1-2 days (audit)
- Phase 2: 2-3 days (backplane setup)
- Phase 3: 3-5 days (first tool migrations)
- Phase 4: 5-7 days (agent refactoring)
- Phase 5: 2-3 days (observability)
- Phase 6: 1-2 days (CI gates)

**Total: ~2-3 weeks for initial migration**

