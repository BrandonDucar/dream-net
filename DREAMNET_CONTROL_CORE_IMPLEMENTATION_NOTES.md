# 🎛️ DreamNet Control Core Implementation Notes
## MVP Implementation Documentation

**Version:** 1.0.0  
**Date:** 2025-01-27  
**Status:** MVP Complete  
**Purpose:** Document the first working version of the DreamNet Control Core implementation.

---

## 📁 Module Locations

### Core Module Structure

```
server/
├── control-core/
│   ├── types.ts          # TypeScript type definitions
│   ├── loaders.ts        # Document loaders for Self-Model and related docs
│   └── ControlCore.ts   # Main Control Core implementation
└── routes/
    └── admin.ts          # Admin Dashboard API routes
```

### Key Files

1. **`server/control-core/types.ts`**
   - All TypeScript type definitions
   - Core types: `CoreValue`, `DivineLaw`, `OverviewSnapshot`, `ConsciousnessSnapshot`, `GovernanceSnapshot`
   - Action/Event types: `ActionCandidate`, `EventCandidate`, `LawEvaluationResult`

2. **`server/control-core/loaders.ts`**
   - Document loading functions
   - Parses markdown files from repo root
   - Extracts sections by heading
   - Loads: Core Values, Divine Laws, Constraints, Rights, Balance Rules, Identity

3. **`server/control-core/ControlCore.ts`**
   - Main Control Core class implementation
   - Implements `IControlCore` interface
   - Singleton pattern via `getControlCore()`
   - Methods: `getOverviewSnapshot()`, `getConsciousnessSnapshot()`, `getGovernanceSnapshot()`, `evaluateActionAgainstLaws()`, `classifyEventPath()`

4. **`server/routes/admin.ts`**
   - Express router for Admin Dashboard APIs
   - Routes: `/api/admin/overview`, `/api/admin/consciousness`, `/api/admin/governance/laws`
   - Additional routes: `/api/admin/evaluate-action`, `/api/admin/classify-event`

---

## 🔧 Types

### Core Types

**CoreValue:**
```typescript
{
  id: string;
  name: string;
  description: string;
  priority: number; // 1 = highest priority
  encoding?: string[]; // Where this value is encoded
}
```

**DivineLaw:**
```typescript
{
  id: string;
  name: string;
  statement: string;
  meaning: string;
  enforcement?: string[];
  violationConsequences?: string[];
}
```

**OverviewSnapshot:**
- Contains organism status, organ statuses, global health, current mood, destiny alignment, recent activity, identity, core values

**ConsciousnessSnapshot:**
- Contains attention focus, perception sources, reason decisions, reflex events, value trade-offs, learning

**GovernanceSnapshot:**
- Contains Divine Laws, Core Values, Constraints, Rights, Balance Rules

### Action/Event Types

**ActionCandidate:**
```typescript
{
  id: string;
  type: string;
  description: string;
  target?: string;
  parameters?: Record<string, unknown>;
}
```

**EventCandidate:**
```typescript
{
  id: string;
  type: string;
  severity?: "critical" | "high" | "medium" | "low";
  source?: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}
```

**LawEvaluationResult:**
```typescript
{
  valid: boolean;
  violations: LawViolation[];
  warnings: string[];
  passedLaws: string[];
}
```

---

## 📚 How to Extend the Control Core

### Adding New Document Loaders

1. **Create loader function in `loaders.ts`:**
```typescript
export function loadNewData(): NewDataType[] {
  const content = loadMarkdownDoc("DREAMNET_NEW_DOC.md");
  const section = extractSection(content, "Section Name");
  // Parse and return data
  return [];
}
```

2. **Add to Control Core class:**
```typescript
private newData = loadNewData();
```

3. **Use in snapshot methods:**
```typescript
async getNewSnapshot(): Promise<NewSnapshot> {
  return {
    newData: this.newData,
    // ... other data
  };
}
```

### Adding New API Endpoints

1. **Add route to `server/routes/admin.ts`:**
```typescript
router.get("/new-endpoint", async (req: Request, res: Response) => {
  try {
    const controlCore = getControlCore();
    const snapshot = await controlCore.getNewSnapshot();
    res.json(snapshot);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

### Enhancing Law Evaluation

1. **Add new law check in `evaluateActionAgainstLaws()`:**
```typescript
case "new-law":
  if (actionLower.includes("forbidden-pattern")) {
    passed = false;
    violationReason = "Action violates new law";
  }
  break;
```

### Enhancing Event Classification

1. **Add new classification logic in `classifyEventPath()`:**
```typescript
if (input.type.toLowerCase().includes("new-pattern")) {
  return "REFLEX"; // or "REASON"
}
```

### Adding Real Data Sources

Currently, many methods return stubbed data. To add real data:

1. **For Organ Statuses:**
   - Integrate with actual subsystem health checks
   - Query DreamKeeper, Shield Core, StarBridge, etc.
   - Update `getOrganStatuses()` method

2. **For Global Health:**
   - Integrate with metrics collection
   - Query metrics engine or database
   - Update `getOverviewSnapshot()` method

3. **For Recent Activity:**
   - Integrate with event logs
   - Query StarBridge event bus or database
   - Update `getOverviewSnapshot()` method

4. **For Consciousness Data:**
   - Integrate with actual decision logs
   - Query Control Core action history
   - Update `getConsciousnessSnapshot()` method

---

## 🔌 API Endpoints

### GET /api/admin/overview

**Purpose:** Get high-level organism status snapshot

**Response:**
```typescript
{
  organismStatus: {
    health: "healthy" | "degraded" | "critical";
    mode: "observe" | "advise" | "semi-auto" | "full-auto";
    uptime: number;
    avgResponseTime: number;
  };
  organStatus: { ... };
  globalHealth: { ... };
  currentMood: { ... };
  destinyAlignment: { ... };
  recentActivity: Activity[];
  identity: { ... };
  coreValues: CoreValue[];
}
```

### GET /api/admin/consciousness

**Purpose:** Get consciousness and decision data

**Response:**
```typescript
{
  attention: { ... };
  reasonDecisions: ReasonDecision[];
  reflexEvents: ReflexEvent[];
  valueTradeOffs: ValueTradeOff[];
  learning: { ... };
  perception: { ... };
}
```

### GET /api/admin/governance/laws

**Purpose:** Get Divine Laws and Core Values

**Response:**
```typescript
{
  divineLaws: DivineLaw[];
  coreValues: CoreValue[];
  constraints: Constraint[];
  rights: Right[];
  balanceRules: BalanceRule[];
}
```

### POST /api/admin/evaluate-action

**Purpose:** Evaluate a hypothetical action against Divine Laws (read-only)

**Request Body:**
```typescript
{
  id: string;
  type: string;
  description: string;
  target?: string;
  parameters?: Record<string, unknown>;
}
```

**Response:**
```typescript
{
  valid: boolean;
  violations: LawViolation[];
  warnings: string[];
  passedLaws: string[];
}
```

### POST /api/admin/classify-event

**Purpose:** Classify an event as REFLEX or REASON

**Request Body:**
```typescript
{
  id: string;
  type: string;
  severity?: "critical" | "high" | "medium" | "low";
  source?: string;
  timestamp?: Date;
  data?: Record<string, unknown>;
}
```

**Response:**
```typescript
{
  pathway: "REFLEX" | "REASON";
  event: EventCandidate;
}
```

---

## 🧪 Testing

### Manual Testing

Create a test script: `scripts/test-control-core.ts`

```typescript
import { getControlCore } from "../server/control-core/ControlCore.js";

async function test() {
  const controlCore = getControlCore();
  
  // Test overview
  const overview = await controlCore.getOverviewSnapshot();
  console.log("Overview:", JSON.stringify(overview, null, 2));
  
  // Test consciousness
  const consciousness = await controlCore.getConsciousnessSnapshot();
  console.log("Consciousness:", JSON.stringify(consciousness, null, 2));
  
  // Test governance
  const governance = await controlCore.getGovernanceSnapshot();
  console.log("Governance:", JSON.stringify(governance, null, 2));
  
  // Test action evaluation
  const action = {
    id: "test-action",
    type: "modify-config",
    description: "Disable Shield Core defense",
  };
  const evaluation = controlCore.evaluateActionAgainstLaws(action);
  console.log("Action Evaluation:", JSON.stringify(evaluation, null, 2));
  
  // Test event classification
  const event = {
    id: "test-event",
    type: "threat-detected",
    severity: "critical",
    timestamp: new Date(),
  };
  const pathway = controlCore.classifyEventPath(event);
  console.log("Event Pathway:", pathway);
}

test().catch(console.error);
```

### API Testing

Use curl or Postman to test endpoints:

```bash
# Get overview
curl http://localhost:3000/api/admin/overview

# Get consciousness
curl http://localhost:3000/api/admin/consciousness

# Get governance
curl http://localhost:3000/api/admin/governance/laws

# Evaluate action
curl -X POST http://localhost:3000/api/admin/evaluate-action \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-action",
    "type": "modify-config",
    "description": "Disable Shield Core defense"
  }'

# Classify event
curl -X POST http://localhost:3000/api/admin/classify-event \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-event",
    "type": "threat-detected",
    "severity": "critical"
  }'
```

---

## 🚀 Next Steps

### Phase 1 Enhancements (Current MVP)

1. **Add Real Data Sources:**
   - Integrate with actual subsystem health checks
   - Query metrics and event logs
   - Replace stubbed data with real data

2. **Improve Document Parsing:**
   - More robust markdown parsing
   - Handle edge cases
   - Support multiple document formats

3. **Add Caching:**
   - Cache loaded documents
   - Cache snapshots (with TTL)
   - Invalidate on document changes

### Phase 2: Semi-Auto Mode

1. **Implement Decision Router:**
   - More sophisticated event classification
   - Priority-based routing
   - Conflict resolution

2. **Implement Reflex Engine:**
   - Fast-path action execution
   - Threat handling
   - Error recovery

3. **Implement Law & Invariant Guard:**
   - More comprehensive law checking
   - Pre-check pipeline
   - Violation prevention

### Phase 3: Full Integration

1. **Integrate with Subsystems:**
   - Real-time organ status
   - Event stream integration
   - Metrics collection

2. **Integrate with Cursor:**
   - Neuro-Link bridge
   - Reasoning requests
   - Plan validation

3. **Add Mode Management:**
   - Mode switching
   - Mode constraints
   - Mode transitions

---

## 📝 Notes

### Current Limitations

1. **Stubbed Data:**
   - Many methods return stubbed/example data
   - Real data integration needed for production

2. **Simple Parsing:**
   - Markdown parsing is basic
   - May not handle all edge cases
   - Consider using a proper markdown parser library

3. **No Caching:**
   - Documents are loaded on every request
   - No snapshot caching
   - Performance may degrade with scale

4. **No Real-Time Updates:**
   - Snapshots are static
   - No WebSocket/SSE integration yet
   - No event streaming

### Safety Considerations

1. **Read-Only MVP:**
   - All endpoints are read-only or evaluation-only
   - No mutating actions
   - Safe for testing

2. **Error Handling:**
   - All methods have try-catch
   - Errors are logged and returned
   - No silent failures

3. **Validation:**
   - Input validation on API endpoints
   - Type checking via TypeScript
   - Law evaluation is conservative (fails safe)

---

## 🔗 Related Documentation

- **`DREAMNET_CONTROL_CORE_SPEC.md`** - Full specification
- **`DREAMNET_SELF_MODEL.md`** - Self-Model document (source of truth)
- **`DREAMNET_ADMIN_DASHBOARD_SPEC.md`** - Admin Dashboard specification
- **`DREAMNET_EXTERNAL_BRIEFING.md`** - Technical overview

---

**End of Implementation Notes**

*This document describes the MVP implementation of the DreamNet Control Core. For the full specification, see `DREAMNET_CONTROL_CORE_SPEC.md`.*

