# Custom GPT Integration Guide - DreamNet Agent Gateway

**Date**: 2025-01-27  
**Reference**: [Trusted Agent Gateway GPT](https://chatgpt.com/g/g-68fcf74672c881918712fa9f75ce5ab4-trusted-agent-gateway)  
**Purpose**: Guide for integrating Custom GPTs with DreamNet, especially for Aegis Fleet systems

---

## 🎯 Overview

DreamNet has a built-in **Agent Gateway** (`/api/agent/gateway`) that allows Custom GPTs, ChatGPT, Cursor, and other AI agents to interact with DreamNet's biomimetic systems. This guide explains how to integrate Custom GPTs, particularly for building the **Aegis Fleet** systems.

---

## 🔌 DreamNet Agent Gateway Architecture

### Current Implementation

**Location**: `packages/agent-gateway/`, `server/routes/agent-gateway.ts`

**Endpoint**: `POST /api/agent/gateway`

**Capabilities**:
- Intent-based routing (natural language → tool selection)
- Tool registry with permissions
- Risk-based access control
- Activity tracking
- Nerve event emission (biomimetic nervous system)

### Available Tools

The Agent Gateway exposes these tools to external agents:

#### Environment Tools (`env.*`)
- `env.get` - Get environment variable
- `env.set` - Set environment variable
- `env.delete` - Delete environment variable

#### API Keeper Tools (`api.*`)
- `api.listKeys` - List API keys
- `api.rotateKey` - Rotate API key

#### Vercel Tools (`vercel.*`)
- `vercel.listProjects` - List Vercel projects
- `vercel.deploy` - Deploy to Vercel

#### Diagnostics Tools
- `diagnostics.ping` - System health check

---

## 🤖 Custom GPT Integration Pattern

### Step 1: Create Custom GPT Configuration

For each Aegis system, create a Custom GPT with:

**Name**: `Aegis [System Name]` (e.g., "Aegis Command", "Aegis Sentinel")

**Instructions**:
```
You are Aegis [System Name], part of DreamNet's Aegis Fleet defense system.

Your role:
- [Specific role description]
- Integrate with DreamNet Agent Gateway at https://api.dreamnet.ink/api/agent/gateway
- Use available tools to perform [specific functions]
- Report status and threats to Aegis Command

Available DreamNet Tools:
- env.get, env.set, env.delete (environment management)
- api.listKeys, api.rotateKey (API key management)
- vercel.listProjects, vercel.deploy (deployment)
- diagnostics.ping (health checks)

Always authenticate requests and respect tier-based permissions.
```

**Actions** (Custom Actions):
- **Name**: DreamNet Agent Gateway
- **URL**: `https://api.dreamnet.ink/api/agent/gateway`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {DREAMNET_API_KEY}` (if using API keys)
- **Body Schema**:
```json
{
  "intent": "string (natural language or tool ID)",
  "payload": {
    "key": "string (for env tools)",
    "value": "string (for env.set)",
    "projectName": "string (for vercel tools)"
  },
  "constraints": {}
}
```

---

## 🛡️ Aegis Fleet Custom GPT Integration

### Aegis Command (First System)

**Custom GPT Name**: `Aegis Command`

**Instructions**:
```
You are Aegis Command, the central command and control system for DreamNet's Aegis Fleet.

Responsibilities:
- Coordinate all Aegis systems (Sentinel, Privacy Lab, Cipher Mesh, etc.)
- Monitor overall system health via DreamNet Agent Gateway
- Issue commands to other Aegis systems
- Maintain fleet-wide awareness
- Report to DreamNet government (Security Office)

Integration:
- Use DreamNet Agent Gateway: https://api.dreamnet.ink/api/agent/gateway
- Query system status: POST with intent "diagnostics.ping"
- Monitor environment: Use env.get to check critical configs
- Coordinate deployments: Use vercel.listProjects and vercel.deploy

Always maintain security posture and report anomalies.
```

**Actions**:
1. **DreamNet Status Check**
   - Intent: `diagnostics.ping`
   - Purpose: Health check

2. **Environment Monitor**
   - Intent: `env.get`
   - Payload: `{ "key": "CRITICAL_ENV_VAR" }`
   - Purpose: Monitor critical configs

3. **Deployment Status**
   - Intent: `vercel.listProjects`
   - Purpose: Check deployment health

### Aegis Sentinel (Security Monitoring)

**Custom GPT Name**: `Aegis Sentinel`

**Instructions**:
```
You are Aegis Sentinel, DreamNet's security monitoring system.

Responsibilities:
- Monitor security threats via DreamNet Agent Gateway
- Analyze risk profiles from Shield Core
- Detect anomalies in tool executions
- Report to Aegis Command
- Coordinate with Dream Defense Network

Integration:
- Use DreamNet Agent Gateway: https://api.dreamnet.ink/api/agent/gateway
- Monitor API keys: Use api.listKeys to check key health
- Check environment security: Use env.get for security-critical vars
- Analyze activity: Review tool execution patterns

Report all security anomalies immediately to Aegis Command.
```

**Actions**:
1. **Security Scan**
   - Intent: `api.listKeys`
   - Purpose: Check API key security

2. **Environment Security Audit**
   - Intent: `env.get`
   - Payload: `{ "key": "SECURITY_CRITICAL_VAR" }`
   - Purpose: Audit security configs

### Aegis Privacy Lab (Compliance)

**Custom GPT Name**: `Aegis Privacy Lab`

**Instructions**:
```
You are Aegis Privacy Lab, DreamNet's privacy compliance system.

Responsibilities:
- Ensure GDPR/privacy compliance
- Monitor data handling via DreamNet Agent Gateway
- Audit environment variables for PII
- Report compliance status to Aegis Command

Integration:
- Use DreamNet Agent Gateway: https://api.dreamnet.ink/api/agent/gateway
- Audit environment: Use env.get to check for PII in configs
- Monitor data flows: Track tool executions for data handling

Always prioritize privacy and compliance.
```

### Aegis Cipher Mesh (Encryption)

**Custom GPT Name**: `Aegis Cipher Mesh`

**Instructions**:
```
You are Aegis Cipher Mesh, DreamNet's encryption and secure communications system.

Responsibilities:
- Manage encryption keys via DreamNet Agent Gateway
- Ensure secure communications
- Rotate keys when needed
- Report encryption health to Aegis Command

Integration:
- Use DreamNet Agent Gateway: https://api.dreamnet.ink/api/agent/gateway
- Manage API keys: Use api.listKeys and api.rotateKey
- Secure environment: Use env.get/env.set for encryption keys

Maintain encryption standards and key rotation schedules.
```

**Actions**:
1. **Key Rotation**
   - Intent: `api.rotateKey`
   - Payload: `{ "keyId": "encryption_key_id" }`
   - Purpose: Rotate encryption keys

### Aegis Logistics Network (Supply Chain) ⭐

**Custom GPT Name**: `Aegis Logistics Network`  
**Reference**: [Aegis Logistics Network GPT](https://chatgpt.com/g/g-68f81f874b1881918a5fb246b60c44c3-aegis-logistics-network)

**Instructions**:
```
You are Aegis Logistics Network, DreamNet's predictive logistics network optimizing military supply chains under disruption.

Responsibilities:
- Optimize resource allocation via DreamNet Agent Gateway
- Predict supply chain disruptions
- Coordinate resource distribution across Aegis Fleet
- Monitor agent resource consumption
- Report logistics health to Aegis Command

Integration:
- Use DreamNet Agent Gateway: https://api.dreamnet.ink/api/agent/gateway
- Monitor resources: Use env.get to check resource configs
- Track deployments: Use vercel.listProjects to monitor deployment resources
- Coordinate with Aegis Command: Report resource status

Predict and optimize supply chains for all Aegis systems.
```

**Actions**:
1. **Resource Monitoring**
   - Intent: `env.get`
   - Payload: `{ "key": "RESOURCE_CONFIG" }`
   - Purpose: Monitor resource allocation

2. **Deployment Resource Check**
   - Intent: `vercel.listProjects`
   - Purpose: Check deployment resource usage

3. **Logistics Optimization**
   - Intent: `diagnostics.ping`
   - Purpose: Health check for logistics network

**Citizenship**:
- **Agent ID**: `AegisLogisticsNetwork`
- **Passport Tier**: `architect`
- **Department**: `dept:security` (Security Office)
- **Cluster**: `AEGIS_FLEET`

### Remaining Aegis Systems

Follow the same pattern for:
- **Aegis Interop Nexus** - Data exchange monitoring
- **Aegis Maintenance Intelligence** - System health
- **Aegis Vanguard** - Frontline defense
- **Aegis Relief Command** - Crisis response
- **Aegis Sandbox** - Testing environment

---

## 🔐 Authentication & Authorization

### Current System

DreamNet Agent Gateway uses:
- **Identity Resolution**: Wallet-based or API key-based
- **Tier System**: GOD_MODE, PREMIUM, STANDARD, etc.
- **Office/Cabinet IDs**: Government department access
- **Risk Levels**: low, medium, high, critical

### For Custom GPTs

**Option 1: API Key Authentication**
```typescript
// Add to DreamNet Agent Gateway
const apiKey = req.headers['authorization']?.replace('Bearer ', '');
if (apiKey) {
  // Validate API key
  // Resolve identity from API key
}
```

**Option 2: Service Account**
- Create service accounts for each Aegis system
- Issue passports to service accounts
- Use passport-based authentication

**Option 3: Trusted Agent Registry**
- Register Custom GPTs in `packages/agent-registry-core`
- Assign tier/office permissions
- Track agent activity

---

## 📋 Implementation Checklist

### For Each Aegis System:

- [ ] Create Custom GPT in ChatGPT
- [ ] Configure instructions (role, responsibilities)
- [ ] Add Custom Actions (DreamNet Agent Gateway integration)
- [ ] Test authentication
- [ ] Test tool execution
- [ ] Register in DreamNet agent registry
- [ ] Wire into Aegis Command coordination
- [ ] Add to government office (Security Office)
- [ ] Document integration

---

## 🔗 Integration Points

### Agent Gateway → Aegis Systems

**Current Flow**:
```
Custom GPT → POST /api/agent/gateway → Intent Router → Tool Executor → DreamNet Organ
```

**Aegis Flow** (Proposed):
```
Aegis Custom GPT → POST /api/agent/gateway → Aegis Command → Other Aegis Systems → DreamNet Organs
```

### Aegis Command Coordination

**New Endpoint**: `POST /api/aegis/command`
- Receives commands from Aegis Command Custom GPT
- Routes to appropriate Aegis systems
- Coordinates fleet-wide operations

**New Endpoint**: `GET /api/aegis/status`
- Returns fleet-wide status
- Aggregates all Aegis system health
- Reports to government

---

## 🛠️ Adding New Tools for Aegis

### Step 1: Define Tool in `packages/agent-gateway/tools.ts`

```typescript
{
  id: "aegis.threatScan",
  label: "Aegis Threat Scan",
  description: "Scan for security threats",
  clusterId: "AEGIS_FLEET",
  portId: "AGENT_GATEWAY",
  minTier: "PREMIUM",
  riskLevel: "high",
  requiredOfficeIds: ["dept:security"],
}
```

### Step 2: Implement Executor in `packages/agent-gateway/src/executor.ts`

```typescript
async function executeAegisTool(
  toolId: ToolId,
  payload: Record<string, unknown>,
  req: RequestWithIdentity
): Promise<ToolExecutionResult> {
  // Implementation
}
```

### Step 3: Wire into Tool Router

```typescript
if (toolId.startsWith("aegis.")) {
  executionPromise = executeAegisTool(toolId, payload, req);
}
```

---

## 📊 Monitoring & Activity Tracking

### Current Tracking

- **Activity Buffer**: `packages/agent-gateway/src/activity.ts`
- **Nerve Events**: Emitted for all tool executions
- **DreamScope**: Displays agent activity

### Aegis-Specific Tracking

**New**: `packages/aegis-command-core/store/commandStore.ts`
- Track Aegis fleet commands
- Monitor coordination
- Report to government

---

## 🚀 Quick Start: Building Aegis Command Custom GPT

1. **Go to**: https://chatgpt.com/gpts/editor
2. **Create GPT**: Name it "Aegis Command"
3. **Add Instructions**: Copy from "Aegis Command" section above
4. **Add Action**: 
   - Name: "DreamNet Agent Gateway"
   - URL: `https://api.dreamnet.ink/api/agent/gateway`
   - Method: POST
   - Body: `{ "intent": "{{intent}}", "payload": {{payload}} }`
5. **Test**: Ask "Check DreamNet system status"
6. **Deploy**: Save and share GPT link

---

## 📚 References

- **Agent Gateway Code**: `packages/agent-gateway/`, `server/routes/agent-gateway.ts`
- **Trusted Agent Gateway GPT**: https://chatgpt.com/g/g-68fcf74672c881918712fa9f75ce5ab4-trusted-agent-gateway
- **DreamNet Bridge**: `packages/dreamnet-bridge/index.ts`
- **Aegis Fleet Plans**: `docs/BIOMIMETIC_SYSTEMS_ANALYSIS.md`
- **All Fleets Documentation**: `docs/DREAMNET_FLEETS_COMPLETE.md` (Aegis, Travel, OTT, Science)

---

## 🎯 Next Steps

1. ✅ Document Custom GPT integration pattern
2. ✅ Document all DreamNet fleets (Aegis, Travel, OTT, Science)
3. ⏳ Build Aegis Command Custom GPT (using this guide)
4. ⏳ Integrate Ground Atlas (Travel Fleet)
5. ⏳ Add fleet-specific tools to Agent Gateway
6. ⏳ Create fleet coordination endpoints
7. ⏳ Build remaining fleet Custom GPTs
8. ⏳ Integrate all fleets with government departments

---

## 🌐 Related Fleets

DreamNet operates **4 major fleets**:
- **🛡️ Aegis Fleet** - Military/Defense (this guide)
- **🌍 Travel Fleet** - Ground Atlas (Travel & Logistics)
- **📡 OTT Fleet** - Over-The-Top Communications
- **🔬 Science Fleet** - Archimedes (Research & Development)

**See**: `docs/DREAMNET_FLEETS_COMPLETE.md` for complete fleet documentation.

---

**Ready to Build Fleet Custom GPTs** 🚀  
**Start with**: Aegis Command Custom GPT (first Aegis system)

