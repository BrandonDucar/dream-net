# 🎛️ Governor/Throttle vs Keep-Alive: Understanding the Difference

## Two Different Concerns

### 🛡️ **Governor & Throttle** (Application-Level Control)
**What they do:**
- **Port Governor** - Controls access to ports (rate limiting, tier-based access)
- **Conduit Governor** - Enforces per-conduit budgets (`maxCallsPerMinute`, execution timeouts)
- **Budget Control Service** - Limits API spending (OpenAI, Anthropic, etc.)

**Purpose:** Prevent runaway costs and control resource usage **while the service is running**

**Example:**
```typescript
// Conduit Governor blocks if > 60 calls/minute
evaluateConduit(portId, clusterId, toolId)
// Returns: { allowed: false, reason: "CONDUIT_RATE_LIMIT" }

// Budget Control blocks if over $100/month
BudgetControlService.requireBudget('openai', 0.01)
// Throws: "Provider 'openai' is over budget"
```

**Does NOT prevent:** Cloud Run from scaling to zero
**Does prevent:** Agents from making too many API calls or spending too much

---

### 🔄 **Keep-Alive** (Infrastructure-Level Control)
**What it does:**
- Sets `minInstances > 0` in Cloud Run
- Prevents the **container itself** from shutting down
- Keeps the service running 24/7

**Purpose:** Ensure the service is always available (no cold starts)

**Example:**
```bash
# Cloud Run configuration
--min-instances=1  # Always keep 1 instance running
```

**Does prevent:** Cloud Run from scaling to zero (service shutdown)
**Does NOT control:** How much compute agents use (that's Governor's job)

---

## How They Work Together

```
┌─────────────────────────────────────────┐
│  Cloud Run Service (Container)          │
│  ┌───────────────────────────────────┐  │
│  │  DreamNet Application             │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Port Governor              │  │  │  ← Controls access
│  │  │  Conduit Governor           │  │  │  ← Throttles calls
│  │  │  Budget Control Service     │  │  │  ← Limits spending
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  Agents & Tools                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↑
         │
    Keep-Alive
    (minInstances > 0)
    Prevents container shutdown
```

---

## What Each System Controls

| System | Controls | Prevents | Doesn't Control |
|--------|----------|----------|-----------------|
| **Port Governor** | Port access, rate limits | Too many requests per minute | Service shutdown |
| **Conduit Governor** | Per-conduit budgets, timeouts | Runaway API calls | Service shutdown |
| **Budget Control** | API spending limits | Over-budget spending | Service shutdown |
| **Keep-Alive** | Container lifecycle | Scale-to-zero | Agent compute usage |

---

## Real-World Scenario

### Scenario: Agent tries to make 1000 API calls

1. **Port Governor** checks: "Is this tier allowed? Rate limit OK?"
   - ✅ Allows if within limits
   - ❌ Blocks if rate limited

2. **Conduit Governor** checks: "Is this conduit within budget?"
   - ✅ Allows if < 60 calls/minute
   - ❌ Blocks if over limit

3. **Budget Control** checks: "Is OpenAI budget OK?"
   - ✅ Allows if under $100/month
   - ❌ Blocks if over budget

4. **Keep-Alive** (separate concern): "Is the service running?"
   - ✅ Service is running (minInstances=1)
   - ❌ Service scaled to zero (minInstances=0) → **Cold start delay**

---

## Answer to Your Question

**"Doesn't the governor and throttle take care of all that?"**

**Partially, but not completely:**

✅ **Governor/Throttle handle:**
- Preventing runaway API costs
- Rate limiting agent calls
- Budget enforcement
- Access control

❌ **Governor/Throttle DON'T handle:**
- Keeping Cloud Run container alive
- Preventing scale-to-zero
- Cold start delays

**You still need Keep-Alive (`minInstances > 0`) to prevent shutdown.**

---

## Recommended Setup

### **For Cost Control (Governor/Throttle):**
Already implemented! ✅
- Port Governor: Active
- Conduit Governor: Active
- Budget Control: Active

### **For Service Availability (Keep-Alive):**
Choose one:

**Option 1: Always On (Recommended for Production)**
```powershell
.\scripts\configure-cloud-run-keepalive.ps1
# Sets minInstances=1
# Cost: ~$10-30/month
# Benefit: No cold starts, always available
```

**Option 2: Keep-Alive Pings (Cost-Effective)**
```bash
./scripts/setup-heartbeat-scheduler.sh
# Pings every 5 minutes
# Cost: ~$0-5/month
# Trade-off: Possible cold starts (5-10 seconds)
```

---

## Summary

- **Governor/Throttle** = Controls **what agents can do** (prevents runaway costs)
- **Keep-Alive** = Keeps **the service running** (prevents shutdown)

**They're complementary, not redundant!**

You need **both**:
1. **Governor/Throttle** to control agent behavior
2. **Keep-Alive** to ensure the service stays up

